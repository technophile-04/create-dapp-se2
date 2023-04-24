import { execa } from "execa";

export async function createProjectDirectory(
  projectDir: string,
  targetDir: string
) {
  const result = await execa("mkdir", [projectDir], {
    cwd: targetDir,
  });

  if (result.failed) {
    return Promise.reject(new Error("Failed to create directory"));
  }

  return true;
}
