import { JwtAuthGuard } from "./auth/jwt-auth.guard";

describe("JwtAuthGuard", () => {
  it("should be defined", () => {
    expect(new JwtAuthGuard()).toBeDefined();
  });
});
