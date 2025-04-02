import { isPowerOfTwo, formatNumberWithCommas } from "../helpers";

describe("Tests formatNumberWithCommas function", () => {
  test("Formats empty/Undefined inputs", () => {
    expect(formatNumberWithCommas(undefined)).toBe("");
  });

  test("Formats numbers that need commas correctly", () => {
    expect(formatNumberWithCommas(1)).toBe("1");
    expect(formatNumberWithCommas(10)).toBe("10");
    expect(formatNumberWithCommas(753)).toBe("753");
    expect(formatNumberWithCommas(1000)).toBe("1,000");
    expect(formatNumberWithCommas(123456)).toBe("123,456");
    expect(formatNumberWithCommas(9876543210)).toBe("9,876,543,210");
  });

  test("Formats negative numbers", () => {
    expect(formatNumberWithCommas(-1)).toBe("-1");
    expect(formatNumberWithCommas(-10)).toBe("-10");
    expect(formatNumberWithCommas(-753)).toBe("-753");
    expect(formatNumberWithCommas(-1000)).toBe("-1,000");
    expect(formatNumberWithCommas(-123456)).toBe("-123,456");
    expect(formatNumberWithCommas(-9876543210)).toBe("-9,876,543,210");
  });

  test("Formats decimals", () => {
    expect(formatNumberWithCommas(753.25)).toBe("753.25");
    expect(formatNumberWithCommas(1000.52)).toBe("1,000.52");
    expect(formatNumberWithCommas(123456.987654)).toBe("123,456.988");
  })
});

describe("Tests isPowerOfTwo function", () => {
  test.each([
    [1, true],
    [2, true],
    [1024, true],
    [2048, true],
    [524288, true],
    [8388608, true],
    [0, false],
    [3, false],
    [6, false],
    [100, false],
    [3072, false],
    [24576, false],
    [6291456, false]
  ])("isPowerOfTwo(%i) returns %s", (input, expected) => {
    expect(isPowerOfTwo(input)).toBe(expected)
  });
});
