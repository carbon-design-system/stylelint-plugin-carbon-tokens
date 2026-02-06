/**
 * Copyright IBM Corp. 2020, 2024
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

declare module '@carbon/layout' {
  export const unstable_tokens: Record<string, string>;
}

declare module '@carbon/type' {
  export const unstable_tokens: Record<string, string>;
}

declare module '@carbon/motion' {
  export const unstable_tokens: Record<string, string>;
}

declare module '@carbon/themes' {
  export const white: Record<string, string>;
  export const g10: Record<string, string>;
  export const g90: Record<string, string>;
  export const g100: Record<string, string>;
  export const tokens: {
    colors?: string[];
  };
  export const unstable_metadata: {
    v11: Array<{
      name: string;
      value: string;
      type: string;
    }>;
  } | undefined;
}

declare module '@carbon/colors' {
  const colors: Record<string, string>;
  export default colors;
}
