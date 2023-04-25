export const smartContractFrameworks = ["hardhat", "foundry", "none"] as const;

export type Args = string[];

export type Template = (typeof smartContractFrameworks)[number];

export type RawOptions = {
  smartContractFramework?: Template;
  project: string;
};

export type Options = RawOptions & {
  smartContractFramework: Template;
};
