/**
 * Copyright IBM Corp. 2020, 2022
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

// There are no type tokens that are used directly
// Types are applied via mixins and functions
// const typeTokens = [];

const doInit = async (target) => {
  // permitted carbon type functions
  // TODO: read this from carbon
  let typeFunctions;
  const isV10 = target === "v10";

  if (isV10 && process.env.NODE_ENV === "test") {
    typeFunctions = [
      {
        name: "carbon--font-weight",
        accept: "acceptCarbonFontWeightFunction"
      },
      {
        name: "carbon--type-scale",
        accept: "acceptCarbonTypeScaleFunction"
      },
      {
        name: "carbon--font-family",
        accept: "acceptCarbonFontFamilyFunction"
      }
    ];
  } else {
    typeFunctions = [
      {
        name: "font-weight",
        accept: "acceptCarbonFontWeightFunction"
      },
      {
        name: "type-scale",
        accept: "acceptCarbonTypeScaleFunction"
      },
      {
        name: "font-family",
        accept: "acceptCarbonFontFamilyFunction"
      }
    ];
  }

  return { typeFunctions };
};

export { doInit };
