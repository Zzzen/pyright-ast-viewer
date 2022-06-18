import { foo } from "../src/index";

describe("test", () => {
  it("foo", () => {
    expect(foo()).toBe(1);
  });
});
