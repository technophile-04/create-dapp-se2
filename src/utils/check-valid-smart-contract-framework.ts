import { smartContractFrameworks } from "../types";

import type { Template } from "../types";

export function checkValidSmartContractFramework(
  template: any
): template is Template {
  return smartContractFrameworks.includes(template);
}
