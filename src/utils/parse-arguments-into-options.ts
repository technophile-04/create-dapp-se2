import type { Args, RawOptions } from "../types";
import { smartContractFrameworks } from "../types";
import { checkValidSmartContractFramework } from "./check-valid-smart-contract-framework";
import arg from "arg";
import chalk from "chalk";

export function parseArgumentsIntoOptions(rawArgs: Args): RawOptions {
  const args = arg(
    {
      "--install": Boolean,
      "-i": "--install",

      "--skip-install": Boolean,
      "--skip": "--skip-install",
      "-s": "--skip-install",

      "--smartContractFramework": String,
      "-f": "--smartContractFramework",
    },
    {
      argv: rawArgs.slice(2).map((a) => a.toLowerCase()),
    }
  );

  const install = args["--install"] ?? null;

  const skipInstall = args["--skip-install"] ?? null;

  const smartContractFramework = args["--smartContractFramework"] ?? null;
  const isTemplateValid = checkValidSmartContractFramework(
    smartContractFramework
  );

  if (smartContractFramework && !isTemplateValid) {
    console.log(
      `%s You passed incorrect template: ${
        args["--smartContractFramework"]
      }. List of supported smart contract frameworks: ${smartContractFrameworks.join(
        ", "
      )}`,
      chalk.yellow.bold("WARNING")
    );
  }

  const project = args._[0] ?? null;

  return {
    project,
    install: install ?? !skipInstall ?? null,
    smartContractFramework:
      smartContractFramework && isTemplateValid ? smartContractFramework : null,
  };
}
