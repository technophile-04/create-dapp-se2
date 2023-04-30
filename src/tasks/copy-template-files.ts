import {
  availableExtensions,
  HandleBarTemplateOptions,
  Options,
} from "../types";
import fs, { stat } from "fs";
import Handlebars from "handlebars";
import ncp from "ncp";
import path from "path";
import { promisify } from "util";
import {
  baseDir,
  extensionsDir,
  handleBarsTemplateFiles,
  solidityFrameworksDir,
} from "../utils/consts";
import { constructYarnWorkspaces } from "../utils/construct-yarn-workspaces";
import { constructHandleBarsTargetFilePath } from "../utils/construct-handlebars-target-file-path";
import { copySolidityFrameWorkDir } from "../utils/copy-solidityFramworks";
import { mergePackageJson } from "../utils/merge-pacakge-json";

const copy = promisify(ncp);

// Process template files
const processAndCopyTemplateFiles = async (
  options: Options,
  templateDir: string,
  targetDir: string
) => {
  let _appImports: string[] = [];
  let _appOutsideComponentCode: string[] = [];
  let _appProviderWrappers: string[] = [];
  let _appProvidersClosingTags: string[] = [];

  // Copy non conflicting files
  options.extensions.forEach((extension) => {
    const extensionsBaseDir = path.join(templateDir, extensionsDir, extension);
    // copy packages dir
    copy(
      path.join(extensionsBaseDir, "packages"),
      path.join(targetDir, "packages"),
      { clobber: false }
    );

    const extensionNextjsDir = path.join(extensionsBaseDir, "nextjs");

    const readAllRootFiles = fs.readdirSync(extensionNextjsDir);
    readAllRootFiles.forEach((name) => {
      const stats = fs.statSync(path.join(extensionNextjsDir, name));
      if (stats.isDirectory()) {
        const targetNextjsDir = path.join(targetDir, "packages", "nextjs");
        copy(
          path.join(extensionNextjsDir, name),
          path.join(targetNextjsDir, name),
          {
            clobber: false,
          }
        );
      }
    });
  });

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
      _appImports,
      _appOutsideComponentCode,
      _appProviderWrappers,
      _appProvidersClosingTags,
    });

    fs.writeFileSync(targetFilePath, result, "utf8");
  });
};

const mergeExtensionsPackageJson = async (
  options: Options,
  templateDir: string,
  targetDir: string
) => {
  options.extensions.forEach((extension) => {
    // eg : extension = graph
    // extensionBaseDir = templateDir/extensions/graph
    const extensionsBaseDir = path.join(templateDir, extensionsDir, extension);

    // merge package.json from extensions nextjs to targetDir nextjs pacakge.json
    mergePackageJson(
      path.join(targetDir, "packages", "nextjs", "package.json"),
      path.join(extensionsBaseDir, "nextjs", "package.json")
    );

    // merge root pacakge json for scripts of extensions
    mergePackageJson(
      path.join(targetDir, "package.json"),
      path.join(extensionsBaseDir, "package.json")
    );
  });
};

export async function mergeSolidityFrameWorksPackageJson(
  options: Options,
  templateDir: string,
  targetDir: string
) {
  if (options.smartContractFramework === "none") return;

  // Also merge root package.json for scripts of solidityFrameworks
  const solidityFrameworkRootPackageJson = path.join(
    templateDir,
    solidityFrameworksDir,
    options.smartContractFramework.toLowerCase(),
    "package.json"
  );

  mergePackageJson(
    path.join(targetDir, "package.json"),
    solidityFrameworkRootPackageJson
  );
}

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

  // 2. Copy smart contract framework folder if selected.(This function only copies non conflicting files like `packages` dir)
  await copySolidityFrameWorkDir(options, templateDir, targetDir);

  // 4. Process template files, depending on enabled extensions
  await processAndCopyTemplateFiles(options, templateDir, targetDir);

  mergeSolidityFrameWorksPackageJson(options, templateDir, targetDir);

  mergeExtensionsPackageJson(options, templateDir, targetDir);
}
