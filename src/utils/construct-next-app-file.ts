import path from "path";
import { Options, templateAppConfig } from "../types";
import fs from "fs";
import { createRequire } from "module";
import { extensionsDir } from "./consts";

/**
 * Generates the closing tag for the given opening tag string.
 * @param {string} openingTag - The opening tag string to generate the closing tag for.
 * @example
 * const openingTag = '<ApolloProvider client={apolloClient}>';
 * const closingTag = createClosingTag(openingTag); // "</ApolloProvider>"
 */
function createClosingTag(openingTag: string) {
  const regex = /^<(\w+)(.*?)>$/;
  const matches = openingTag.match(regex);

  if (!matches) {
    throw new Error("Invalid opening tag format");
  }

  const tagName = matches[1];
  const attributes = matches[2];

  return `</${tagName}>`;
}

const require = createRequire(import.meta.url);

export function constructAppFile(options: Options, templateDir: string) {
  const _appImports: string[] = [];
  const _appOutsideComponentCode: string[] = [];
  const _appProviderWrappers: string[] = [];
  const _appProvidersClosingTags: string[] = [];

  if (options.extensions.includes("none")) {
    return {
      _appImports,
      _appOutsideComponentCode,
      _appProviderWrappers,
      _appProvidersClosingTags,
    };
  }

  options.extensions.forEach((extension) => {
    const extensionsNextjsDir = path.join(
      templateDir,
      extensionsDir,
      extension,
      "nextjs"
    );
    const templateConfig = require(path.join(
      extensionsNextjsDir,
      "template.config.ts"
    )) as templateAppConfig;

    // Merging all _app.tsx import statements
    templateConfig._appImports.forEach((appImport) => {
      if (!_appImports.includes(appImport)) {
        _appImports.push(appImport);
      }
    });

    _appOutsideComponentCode.push(templateConfig._appOutsideComponentCode);

    // Merging all _app.tsx provider wrappers
    templateConfig._appProviderWrappers.forEach((appProviderWrapper) => {
      if (!_appProviderWrappers.includes(appProviderWrapper)) {
        _appProviderWrappers.push(appProviderWrapper);
        _appProvidersClosingTags.push(createClosingTag(appProviderWrapper));
      }
    });
  });

  return {
    _appImports,
    _appOutsideComponentCode,
    _appProviderWrappers,
    _appProvidersClosingTags,
  };
}
