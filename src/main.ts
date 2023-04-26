import { copyTemplateFiles, createProjectDirectory } from "./tasks";
import type { Options } from "./types";
import chalk from "chalk";
import Listr from "listr";
import path from "path";
import { fileURLToPath } from "url";
import { installPackages } from "./tasks/install-packages";

export async function createProject(options: Options) {
  console.log(`\n`);

  const currentFileUrl = import.meta.url;

  const templateDirectory = path.resolve(
    decodeURI(fileURLToPath(currentFileUrl)),
    "../../templates"
  );

  const targetDirectory = path.resolve(process.cwd(), options.project);

  const tasks = new Listr([
    {
      title: `📁 Create project directory ${targetDirectory}`,
      task: () => createProjectDirectory(options.project, process.cwd()),
    },
    {
      title: `🚀 Creating a new Scaffold-ETH 2 app in ${chalk.green.bold(
        options.project
      )}`,
      task: () =>
        copyTemplateFiles(options, templateDirectory, targetDirectory),
    },
    // {
    //   title: `⚙️ Adding the following extensions ${JSON.stringify(
    //     options.extensions
    //   )}`,
    //   task: () =>
    //     copyTemplateFiles(options, templateDirectory, targetDirectory),
    // },
    {
      title: `📦 Installing dependencies with yarn, this could take a while`,
      task: () => installPackages(targetDirectory),
      skip: () => {
        if (!options.install) {
          return "Pass --install or -i to automatically install dependencies";
        }
      },
    },
  ]);

  try {
    await tasks.run();
  } catch (error) {
    console.log("%s Error occurred", chalk.red.bold("ERROR"), error);
  }
}
