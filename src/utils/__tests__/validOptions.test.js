import { isValidOption } from "../";

describe("isValidOptions", () => {
  it("Option to be invalid", () => {
    expect(isValidOption(["/fish"])).toEqual(false);
  });
});
