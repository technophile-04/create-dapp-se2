import { templates } from "../types";

import type { Template } from "../types";

export function checkTemplateValidity(template: any): template is Template {
  return typeof template === "undefined" || templates.includes(template);
}
