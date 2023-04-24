import ncp from "ncp";
import { promisify } from "util";

const copy = promisify(ncp);

export async function copyTemplateFiles(
  templateDir: string,
  targetDir: string
) {
  return copy(templateDir, targetDir, { clobber: false });
}
