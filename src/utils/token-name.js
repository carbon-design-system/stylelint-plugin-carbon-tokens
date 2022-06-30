/**
 * Copyright IBM Corp. 2020, 2022
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

const formatTokenName = (token) => {
  return `${token
    .split(/(?=[A-Z]|[0-9]{2})/)
    .join("-")
    .toLowerCase()}`;
};

export { formatTokenName };
