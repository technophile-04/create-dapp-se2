import chalk from "chalk";
import type { Options } from "../types";
export function renderOutroMessage(options: Options): void {
  const { template } = options;
  let message = `
  \n
  ${chalk.bold.green("Congratulations!")} Your project has been scaffolded! 🎉
  \n
  ${chalk.bold("Next steps:")}
  `;

  switch (template) {
    case "se-2-hardhat":
      message += `
      ${chalk.bold("1. Start the Hardhat development node")}
      ${chalk.dim("cd")} ${options.project}
      ${chalk.dim("yarn")} chain
      \n
      ${chalk.bold("2. In a new terminal window, deploy your contracts")}
      ${chalk.dim("cd")} ${options.project}
      ${chalk.dim("yarn")} deploy
      \n
      ${chalk.bold("3. In a new terminal window, start the frontend")}
      ${chalk.dim("cd")} ${options.project}
      ${chalk.dim("yarn")} start
      `;

      break;
    case "se-2-frontend":
      message += `
      ${chalk.bold("1. In a new terminal window, start the frontend")}
      ${chalk.dim("cd")} ${options.project}
      ${chalk.dim("yarn")} start
      `;
      break;
    default:
      break;
  }

  message += `
  \n
  ${chalk.bold.green("Thanks for using Scaffold-ETH 2 🙏, Happy Building!")}
  `;

  console.log(message);
}
