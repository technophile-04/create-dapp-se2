import { availableExtensions, Options } from "../types";
import fs from "fs";
import Handlebars from "handlebars";
import ncp from "ncp";
import path from "path";
import { promisify } from "util";

const copy = promisify(ncp);

// Array with all template files
const templateFiles = ["nextjs/index.ts.hbs"];

// Process template files, depending on extensions
const processAndCopyTemplateFiles = async (
  options: Options,
  templateDir: string,
  targetDir: string
) => {
  templateFiles.forEach((templateFile) => {
    const targetFile = templateFile.replace(".hbs", "");
    const templateFilePath = path.join(templateDir, templateFile);
    const targetFilePath = path.join(targetDir, targetFile);
    const templateContent = fs.readFileSync(templateFilePath, "utf8");
    const template = Handlebars.compile(templateContent, { noEscape: true });

    // Parse enabled extensions for easy access in handlebars
    const enabledExtensions: any = {};
    options.extensions.forEach((extension) => {
      enabledExtensions[extension] = true;
    });

    const result = template({ ...options, enabledExtensions });
    fs.writeFileSync(targetFilePath, result, "utf8");
  });
};

export async function copyTemplateFiles(
  options: Options,
  templateDir: string,
  targetDir: string
) {
  // 1. Copy all the nextjs (include on every project), except template files
  await copy(path.join(templateDir, "nextjs"), path.join(targetDir, "nextjs"), {
    clobber: false,
    filter: (fileName) => {
      // ignore template files
      return !fileName.includes(".hbs");
    },
  });

  // 2. Copy smart contract framework folder if selected.
  if (options.smartContractFramework !== "none") {
    await copy(
      path.join(templateDir, "/", options.smartContractFramework.toLowerCase()),
      path.join(targetDir, options.smartContractFramework.toLowerCase()),
      { clobber: false }
    );
  }

  // 3. Copy extensions folder/files

  // 4. Process template files, depending on enabled extensions
  await processAndCopyTemplateFiles(options, templateDir, targetDir);
}
