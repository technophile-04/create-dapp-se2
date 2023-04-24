import typescript from "@rollup/plugin-typescript";
import autoExternal from "rollup-plugin-auto-external";

export default {
  input: "src/cli.ts",
  output: {
    dir: "dist",
    format: "es",
  },
  plugins: [autoExternal(), typescript({ exclude: ["templates/**"] })],
};
