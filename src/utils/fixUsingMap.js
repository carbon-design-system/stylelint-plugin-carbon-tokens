/**
 * Copyright IBM Corp. 2022, 2022
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

export const fixUsingMap = (value, target, map) => {
  let workingValue = value;
  let match = target.exec(workingValue);

  while (match) {
    if (map[match[0]]) {
      workingValue = workingValue.replace(match[0], map[match[0]]);
    }

    match = target.exec(workingValue);
  }

  return workingValue;
};
