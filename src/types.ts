export const templates = ["se-2-hardhat", "se-2-frontend"] as const;

export type Args = string[];

export type Template = (typeof templates)[number];

export type RawOptions = {
  git: boolean;
  install: boolean;
  skipPrompts: boolean;
  template?: Template;
  project: string;
};

export type Options = Omit<RawOptions, "skipPrompts"> & {
  template: Template;
};
