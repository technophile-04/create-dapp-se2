import { execa } from "execa";

export async function initGitRepo(targetDir: string) {
  let result = await execa("git", ["init"], {
    cwd: targetDir,
  });

  result = await execa("git", ["add", "."], { cwd: targetDir });

  result = await execa("git", ["commit", "-m", "Initial commit SE-2"], {
    cwd: targetDir,
  });

  if (result.failed) {
    return Promise.reject(new Error("Failed to initialize git"));
  }

  return true;
}
