import inquirer from "inquirer";

import type { Options, RawOptions } from "../types";

// default values for unspecified args
const defaultOptions: Omit<Options, "project"> = {
  git: true,
  install: true,
  template: "se-2-hardhat",
};

// --yes flag is passed
const skipOptions: Omit<Options, "template" | "project"> = {
  git: true,
  install: true,
};

export async function promptForMissingOptions(
  options: RawOptions
): Promise<Options> {
  if (options.skipPrompts) {
    options = { ...options, ...skipOptions };
  }

  const questions = [];

  if (!options.project) {
    questions.push({
      type: "input",
      name: "project",
      message: "Please type project's name (cannot be empty) : ",
      validate: (value: string) => value.length > 0,
    });
  }

  if (!options.template) {
    questions.push({
      type: "list",
      name: "template",
      message: "Please choose which project template to use : ",
      choices: [
        { name: "SE-2 with Hardhat", value: "se-2-hardhat" },
        { name: "SE-2 with only frontend", value: "se-2-frontend" },
      ],
      default: defaultOptions.template,
    });
  }

  if (!options.git) {
    questions.push({
      type: "confirm",
      name: "git",
      message: "Initialize a git repository?",
      default: defaultOptions.git,
    });
  }

  if (!options.install) {
    questions.push({
      type: "confirm",
      name: "install",
      message: "Install packages?",
      default: defaultOptions.install,
    });
  }

  const answers = await inquirer.prompt(questions);

  return {
    git: options.git || answers.git,
    install: options.install || answers.install,
    template: options.template || answers.template,
    project: options.project || answers.project,
  };
}
