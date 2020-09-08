"use strict";

var _ = require("..");

describe("parseOptions", function () {
  var defaults = {
    includeProps: ["1", "3", "4"],
    acceptValues: ["1", "5", "6"],
    acceptCarbonColorTokens: false,
    acceptIBMColorTokens: false,
    acceptUndefinedVariables: true,
  };
  var options1 = undefined;
  it("Uses default options when options undefined", function () {
    expect((0, _.parseOptions)(options1, defaults)).toEqual(defaults);
  });
  var options2 = {};
  it("Uses default options when options {}", function () {
    expect((0, _.parseOptions)(options2, defaults)).toEqual(defaults);
  });
  var options3 = {
    includeProps: [],
  };
  it("Uses default options when options without acceptValues", function () {
    expect((0, _.parseOptions)(options3, defaults)).toEqual(defaults);
  });
  var options4 = {
    acceptValues: [],
  };
  it("Uses default options when options without includeProps", function () {
    expect((0, _.parseOptions)(options4, defaults)).toEqual(defaults);
  });
  var options5 = {
    includeProps: ["*"],
    acceptValues: ["*"],
  };
  it("Uses default options when using * only", function () {
    expect((0, _.parseOptions)(options5, defaults)).toEqual(defaults);
  });
  var options6 = {
    includeProps: ["*", "banana"],
    acceptValues: ["fish", "*"],
  };
  var combinedOpts1 = {
    includeProps: ["banana"].concat(defaults.includeProps),
    acceptValues: ["fish"].concat(defaults.acceptValues),
    acceptCarbonColorTokens: false,
    acceptIBMColorTokens: false,
    acceptUndefinedVariables: true,
  };
  it("Adds default options when using *", function () {
    expect((0, _.parseOptions)(options6, defaults)).toEqual(combinedOpts1);
  });
  var options7 = {
    includeProps: ["*", "cake", "2", "3"],
    acceptValues: ["eagle", "*", "5", "7"],
  };
  var combinedOpts2 = {
    includeProps: ["cake", "2", "3"].concat(
      defaults.includeProps.filter(function (item) {
        return item !== "3";
      })
    ),
    acceptValues: ["eagle", "5", "7"].concat(
      defaults.acceptValues.filter(function (item) {
        return item !== "5";
      })
    ),
    acceptCarbonColorTokens: false,
    acceptIBMColorTokens: false,
    acceptUndefinedVariables: true,
  };
  it("Combines default options when using *", function () {
    expect((0, _.parseOptions)(options7, defaults)).toEqual(combinedOpts2);
  });
});
