// @ts-expect-error We don't have types for this probably add .d.ts file
import mergeJsonStr from "merge-packages";
import {
  availableExtensions,
  HandleBarTemplateOptions,
  Options,
} from "../types";
import fs from "fs";
import Handlebars from "handlebars";
import ncp from "ncp";
import path from "path";
import { promisify } from "util";
import {
  baseDir,
  handleBarsTemplateFiles,
  solidityFrameworksDir,
} from "../utils/consts";
import { constructYarnWorkspaces } from "../utils/construct-yarn-workspaces";
import { constructHandleBarsTargetFilePath } from "../utils/construct-handlebars-target-file-path";
import { CLIENT_RENEG_LIMIT } from "tls";

const copy = promisify(ncp);

// Process template files
const processAndCopyTemplateFiles = async (
  options: Options,
  templateDir: string,
  targetDir: string
) => {
  handleBarsTemplateFiles.forEach((templateFile) => {
    // eg : templateFile = base/package.json.hbs

    // base/package.json.hbs -> base/package.json
    const targetFile = templateFile.replace(".hbs", "");
    const templateFilePath = path.join(templateDir, templateFile);

    const targetFilePath = path.join(
      targetDir,
      // targetDir/base/package.json needs to be converted to targetDir/package.json
      constructHandleBarsTargetFilePath(targetFile)
    );
    const templateContent = fs.readFileSync(templateFilePath, "utf8");
    const template = Handlebars.compile<HandleBarTemplateOptions>(
      templateContent,
      {
        noEscape: true,
      }
    );

    const yarnWorkspaces = constructYarnWorkspaces(options);

    const result = template({
      ...options,
      yarnWorkspaces,
      _appImports: [],
      _appOutsideComponentCode: [],
      _appProviderWrappers: [],
      _appProvidersClosingTags: [],
    });

    fs.writeFileSync(targetFilePath, result, "utf8");
  });
};

const copyFilesFromExtensions = async (
  options: Options,
  templateDir: string,
  targetDir: string
) => {
  console.log("Copying files from extensions");
  options.extensions.forEach((extension) => {
    // Copy "package" folder from extension
    const extensionDir = path.join(templateDir, extension);
    const targetExtensionDir = path.join(targetDir, extension);
    copy(extensionDir, targetExtensionDir, {
      clobber: false,
      filter: (fileName) => {
        // ignore nextjs
        return !fileName.includes("nextjs");
      },
    });
    // Copy extension files/folder into NextJS folder
    // Check if "extension/nextjs" folder exists
    const extensionNextjsDir = path.join(extensionDir, "nextjs");
    if (fs.existsSync(extensionNextjsDir)) {
      // copy that folder into targetDir/nextjs
      const targetExtensionNextjsDir = path.join(targetDir, "nextjs");
      copy(extensionNextjsDir, targetExtensionNextjsDir, {
        clobber: false,
      });
    }
  });
};

export async function copyTemplateFiles(
  options: Options,
  templateDir: string,
  targetDir: string
) {
  // 1. Copy base template to target directory
  await copy(path.join(templateDir, baseDir), targetDir, {
    clobber: false,
    filter: (fileName) => {
      // ignore template files
      return !fileName.includes(".hbs");
    },
  });

  // 2. Copy smart contract framework folder if selected.
  if (options.smartContractFramework !== "none") {
    await copy(
      path.join(
        templateDir,
        solidityFrameworksDir,
        options.smartContractFramework.toLowerCase(),
        "packages",
        options.smartContractFramework.toLowerCase()
      ),
      path.join(
        targetDir,
        "packages",
        options.smartContractFramework.toLowerCase()
      ),
      { clobber: false }
    );
  }

  // 3. Copy extensions folder/files
  // await copyFilesFromExtensions(options, templateDir, targetDir);

  // 4. Process template files, depending on enabled extensions
  await processAndCopyTemplateFiles(options, templateDir, targetDir);

  if (options.smartContractFramework === "none") return;

  // Also merge root package.json for scripts
  const solidityFrameworkRootPackageJson = path.join(
    templateDir,
    solidityFrameworksDir,
    options.smartContractFramework.toLowerCase(),
    "package.json"
  );

  if (fs.existsSync(solidityFrameworkRootPackageJson)) {
    const rootPackageJson = fs.readFileSync(
      path.join(targetDir, "package.json"),
      "utf8"
    );
    const templateRootPackageJson = fs.readFileSync(
      path.join(solidityFrameworkRootPackageJson),
      "utf8"
    );

    console.log("Merge JSON STR", mergeJsonStr);

    const mergedPkgStr = mergeJsonStr.default(
      rootPackageJson,
      templateRootPackageJson
    );

    fs.writeFileSync(
      path.join(targetDir, "package.json"),
      mergedPkgStr,
      "utf8"
    );
  }
}
