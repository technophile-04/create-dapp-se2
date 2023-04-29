export const smartContractFrameworks = ["hardhat", "none"] as const;
export const availableExtensions = ["graph"] as const;

export type Args = string[];

export type Template = (typeof smartContractFrameworks)[number];

export type Extensions = (typeof availableExtensions)[number];

export type RawOptions = {
  smartContractFramework?: Template;
  project: string;
  install: boolean;
};

export type Options = RawOptions & {
  extensions: Extensions[];
  smartContractFramework: Template;
};

export type HandleBarTemplateOptions = Options & {
  yarnWorkspaces: `packages/${string}`[];
  _appImports: string[];
  _appOutsideComponentCode: string[];
  _appProviderWrappers: string[];
  _appProvidersClosingTags: string[];
};
