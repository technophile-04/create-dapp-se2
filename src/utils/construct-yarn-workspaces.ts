import path from "path";
import { Options } from "../types";
import fs from "fs";
import { extensionsDir } from "./consts";

export function constructYarnWorkspaces(
  options: Options,
  templateDir: string
): `packages/${string}`[] {
  //  This can be optimized by using just keeping `packages/*` it will make all the direcotries under packages available as workspace
  const yarnWorkspaces: `packages/${string}`[] = ["packages/nextjs"];

  if (options.smartContractFramework !== "none") {
    yarnWorkspaces.push(`packages/${options.smartContractFramework}`);
  }

  if (options.extensions.includes("none")) return yarnWorkspaces;

  options.extensions.forEach((extension) => {
    const extensionsBaseDir = path.join(templateDir, extensionsDir, extension);
    if (fs.existsSync(path.join(extensionsBaseDir, "packages"))) {
      const packageName = fs.readdirSync(
        path.join(extensionsBaseDir, "packages")
      )[0];
      yarnWorkspaces.push(`packages/${packageName}`);
    }
  });

  return yarnWorkspaces;
}
