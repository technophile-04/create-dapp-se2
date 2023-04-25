import type { Args, RawOptions } from "../types";
import { smartContractFrameworks } from "../types";
import { checkValidSmartContractFramework } from "./check-valid-smart-contract-framework";
import arg from "arg";
import chalk from "chalk";

export function parseArgumentsIntoOptions(
  rawArgs: Args
): Omit<RawOptions, "extensions"> {
  const args = arg(
    {
      "--smartContractFramework": String,
      "-scf": "--smartContractFramework",
    },
    {
      argv: rawArgs.slice(2),
    }
  );

  const smartContractFramework =
    args["--smartContractFramework"]?.toLowerCase();
  const isTemplateValid = checkValidSmartContractFramework(
    smartContractFramework
  );

  if (!isTemplateValid) {
    console.log(
      `%s You passed incorrect template: ${
        args["--smartContractFramework"]
      }. List of supported smart contract frameworks: ${smartContractFrameworks.join(
        ", "
      )}`,
      chalk.yellow.bold("WARNING")
    );
  }

  const project = args._[0]?.toLowerCase();

  return {
    project,
    smartContractFramework: isTemplateValid
      ? smartContractFramework
      : undefined,
  };
}
