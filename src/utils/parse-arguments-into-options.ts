import arg from "arg";
import chalk from "chalk";

import { checkTemplateValidity } from "./check-template-validity";

import type { Args, RawOptions } from "../types";
import { templates } from "../types";

export function parseArgumentsIntoOptions(rawArgs: Args): RawOptions {
  const args = arg(
    {
      "--git": Boolean,
      "--yes": Boolean,
      "--install": Boolean,
      "--template": String,
      "-g": "--git",
      "-y": "--yes",
      "-i": "--install",
      "-t": "--template",
    },
    {
      argv: rawArgs.slice(2),
    }
  );

  const template = args["--template"]?.toLowerCase();
  const isTemplateValid = checkTemplateValidity(template);

  if (!isTemplateValid) {
    console.log(
      `%s You passed incorrect template: ${
        args["--template"]
      }. List of supported templates: ${templates.join(", ")}`,
      chalk.yellow.bold("WARNING")
    );
  }

  const project = args._[0]?.toLowerCase();

  return {
    git: args["--git"] || false,
    install: args["--install"] || false,
    project,
    skipPrompts: args["--yes"] || false,
    template: isTemplateValid ? template : undefined,
  };
}
