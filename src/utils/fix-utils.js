/**
 * Copyright IBM Corp. 2022, 2022
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

export const fixUsingMap = (value, target, map, config) => {
  let workingValue = value;
  let match = target.exec(workingValue);

  while (match) {
    let replacement = map[match[0]];

    if (replacement) {
      if (typeof replacement === "object") {
        const keys = Object.keys(replacement).filter((key) => {
          const rgx = new RegExp(key);

          return rgx.test(config?.prop);
        });

        if (keys.length > 0) {
          replacement = replacement[keys[0]];
        } else {
          replacement = config?.options?.preferContextFixes
            ? replacement.context
            : replacement.standard;
        }
      }

      workingValue = workingValue.replace(match[0], replacement);
    }

    match = target.exec(workingValue);
  }

  return workingValue;
};

export const tryFix = ({ target, replacement, version }, value, config) => {
  if (version === undefined || config.ruleInfo.version.startsWith(version)) {
    if (typeof replacement === "function") {
      return replacement(value, target, config);
    }

    return value.replaceAll(target, replacement);
  }

  return value;
};
