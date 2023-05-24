import type { Options, RawOptions } from "../types";
import inquirer from "inquirer";

// default values for unspecified args
const defaultOptions: Omit<Options, "extensions"> = {
  project: "my-dapp-example",
  smartContractFramework: "hardhat",
  install: true,
};

export async function promptForMissingOptions(
  options: RawOptions
): Promise<Options> {
  const questions = [];

  if (options.project === null) {
    questions.push({
      type: "input",
      name: "project",
      message: "Your project name:",
      default: defaultOptions.project,
      validate: (value: string) => value.length > 0,
    });
  }

  if (options.smartContractFramework === null) {
    questions.push({
      type: "list",
      name: "smartContractFramework",
      message: "Choose your smart contract dev framework: ",
      choices: [
        { name: "Hardhat", value: "hardhat" },
        { name: "None (only frontend)", value: "none" },
      ],
      default: defaultOptions.smartContractFramework,
    });
  }

  questions.push({
    type: "checkbox",
    name: "extensions",
    message: "Choose the extensions that you want to add: ",
    choices: [
      { name: "The graph", value: "graph" },
      { name: "None", value: "none" },
    ],
    default: defaultOptions.smartContractFramework,
  });

  if (options.install === null) {
    questions.push({
      type: "confirm",
      name: "install",
      message: "Install packages?",
      default: defaultOptions.install,
    });
  }

  const answers = await inquirer.prompt(questions);

  return {
    smartContractFramework:
      options.smartContractFramework ?? answers.smartContractFramework,
    project: options.project ?? answers.project,
    extensions: answers.extensions,
    install: options.install ?? answers.install,
  };
}
