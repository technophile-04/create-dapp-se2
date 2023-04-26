import { solidityFrameworksDir } from "./consts";

// targetDir/base/package.json
export function constructHandleBarsTargetFilePath(
  relativeTemplateFilePath: string
) {
  if (relativeTemplateFilePath.startsWith("base/")) {
    return relativeTemplateFilePath.replace("base/", "");
  }

  if (relativeTemplateFilePath.startsWith(solidityFrameworksDir)) {
    return relativeTemplateFilePath.replace(
      `${solidityFrameworksDir}`,
      "packages"
    );
  }

  // TODO: Need to handle case for `extensions` dir properly
  return relativeTemplateFilePath;
}
