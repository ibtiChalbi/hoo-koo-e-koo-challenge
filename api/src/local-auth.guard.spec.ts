import { LocalAuthGuard } from "./auth/local-auth.guard";

describe("LocalAuthGuard", () => {
  it("should be defined", () => {
    expect(new LocalAuthGuard()).toBeDefined();
  });
});
