import inquirer from "inquirer";

import type { Options, RawOptions } from "../types";

// default values for unspecified args
const defaultOptions: Options = {
  project: "my-dapp-example",
  smartContractFramework: "hardhat",
};

export async function promptForMissingOptions(
  options: RawOptions
): Promise<Options> {
  const questions = [];

  if (!options.project) {
    questions.push({
      type: "input",
      name: "project",
      message: "Your project name:",
      default: defaultOptions.project,
      validate: (value: string) => value.length > 0,
    });
  }

  if (!options.smartContractFramework) {
    questions.push({
      type: "list",
      name: "smartContractFramework",
      message: "Choose your smart contract dev framework: ",
      choices: [
        { name: "Hardhat", value: "hardhat" },
        { name: "Foundry", value: "foundry" },
        { name: "None (only frontend)", value: "se-2-frontend" },
      ],
      default: defaultOptions.smartContractFramework,
    });
  }

  const answers = await inquirer.prompt(questions);

  return {
    smartContractFramework: options.smartContractFramework || answers.smartContractFramework,
    project: options.project || answers.project,
  };
}
