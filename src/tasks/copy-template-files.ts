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
import { constructYarnWorkspace } from "../utils/construct-yarn-workspaces";

const copy = promisify(ncp);

// Process template files
const processAndCopyTemplateFiles = async (
  options: Options,
  templateDir: string,
  targetDir: string
) => {
  handleBarsTemplateFiles.forEach((templateFile) => {
    const targetFile = templateFile.replace(".hbs", "");
    const templateFilePath = path.join(templateDir, templateFile);
    const targetFilePath = path.join(targetDir, targetFile);
    const templateContent = fs.readFileSync(templateFilePath, "utf8");
    const template = Handlebars.compile<HandleBarTemplateOptions>(
      templateContent,
      {
        noEscape: true,
      }
    );

    const yarnWorkspaces = constructYarnWorkspace(options);
    const result = template({ ...options, yarnWorkspaces });

    fs.writeFileSync(targetFilePath, result, "utf8");
  });
};

const copyFilesFromExtensions = async (
  options: Options,
  templateDir: string,
  targetDir: string
) => {
  console.log("Copying files from extensions");
  // @ts-expect-error TODO: fix this currently ignoring extensions Dir
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
  await copy(path.join(templateDir, baseDir), path.join(targetDir, baseDir), {
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
}
