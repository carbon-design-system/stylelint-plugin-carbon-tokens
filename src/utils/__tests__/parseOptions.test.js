import { parseOptions } from "../";

describe("parseOptions", () => {
  const defaults = {
    includeProps: ["1", "3", "4"],
    ignoreValues: ["1", "5", "6"],
  };

  const options1 = undefined;

  it("Uses default options when options undefined", () => {
    expect(parseOptions(options1, defaults)).toEqual(defaults);
  });

  const options2 = {};

  it("Uses default options when options {}", () => {
    expect(parseOptions(options2, defaults)).toEqual(defaults);
  });

  const options3 = { includeProps: [] };

  it("Uses default options when options without ignoreValues", () => {
    expect(parseOptions(options3, defaults)).toEqual(defaults);
  });

  const options4 = { ignoreValues: [] };

  it("Uses default options when options without includeProps", () => {
    expect(parseOptions(options4, defaults)).toEqual(defaults);
  });

  const options5 = {
    includeProps: ["*"],
    ignoreValues: ["*"],
  };

  it("Uses default options when using * only", () => {
    expect(parseOptions(options5, defaults)).toEqual(defaults);
  });

  const options6 = {
    includeProps: ["*", "banana"],
    ignoreValues: ["fish", "*"],
  };

  const combinedOpts1 = {
    includeProps: ["banana"].concat(defaults.includeProps),
    ignoreValues: ["fish"].concat(defaults.ignoreValues),
  };

  it("Adds default options when using *", () => {
    expect(parseOptions(options6, defaults)).toEqual(combinedOpts1);
  });

  const options7 = {
    includeProps: ["*", "cake", "2", "3"],
    ignoreValues: ["eagle", "*", "5", "7"],
  };

  const combinedOpts2 = {
    includeProps: ["cake", "2", "3"].concat(
      defaults.includeProps.filter((item) => item !== "3")
    ),
    ignoreValues: ["eagle", "5", "7"].concat(
      defaults.ignoreValues.filter((item) => item !== "5")
    ),
  };

  it("Combines default options when using *", () => {
    expect(parseOptions(options7, defaults)).toEqual(combinedOpts2);
  });
});
