import { Options } from "../types";
import ncp from "ncp";
import path from "path";
import { promisify } from "util";

const copy = promisify(ncp);

export async function compileTemplateFiles(
  options: Options,
  templateDir: string,
  targetDir: string
) {
  await copy(path.join(templateDir, "nextjs"), path.join(targetDir, "nextjs"), {
    clobber: false,
  });
  if (options.smartContractFramework !== "none") {
    await copy(
      path.join(templateDir, "/", options.smartContractFramework.toLowerCase()),
      path.join(targetDir, options.smartContractFramework.toLowerCase()),
      { clobber: false }
    );
  }
}
