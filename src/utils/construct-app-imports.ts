import path from "path";
import { Options, templateAppConfig } from "../types";
import fs from "fs";
import { createRequire } from "module";
import { extensionsDir } from "./consts";

const require = createRequire(import.meta.url);
export function constructAppImports(
  options: Options,
  templateDir: string
): string[] {
  const appImports: string[] = [];

  // if (options.extensions.includes("none")) {
  //   return appImports;
  // }

  options.extensions.forEach((extension) => {
    const extensionsNextjsDir = path.join(
      templateDir,
      extensionsDir,
      extension,
      "nextjs"
    );
    const templateConfig = require(path.join(
      extensionsNextjsDir,
      "template.config.ts"
    )) as templateAppConfig;

    templateConfig._appImports.forEach((appImport) => {
      if (!appImports.includes(appImport)) {
        appImports.push(appImport);
      }
    });
  });

  return appImports;
}
