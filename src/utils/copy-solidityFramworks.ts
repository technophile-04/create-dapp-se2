import path from "path";
import { Options } from "../types";
import { solidityFrameworksDir } from "./consts";
import { promisify } from "util";
import ncp from "ncp";

const copy = promisify(ncp);

export async function copySolidityFrameWorkDir(
  options: Options,
  templateDir: string,
  targetDir: string
) {
  if (options.smartContractFramework === "none") return;

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
