import { Options } from "../types";

export function constructYarnWorkspace(
  options: Options
): `packages/${string}`[] {
  //  This can be optimized by using just keeping `packages/*` it will make all the direcotries under packages available as workspace
  const yarnWorkspaces: `packages/${string}`[] = ["packages/nextjs"];

  if (options.smartContractFramework) {
    yarnWorkspaces.push(`packages/${options.smartContractFramework}`);
  }

  return yarnWorkspaces;
}
