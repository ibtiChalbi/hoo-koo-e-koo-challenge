import { Strategy } from "passport-local";
import { PassportStrategy } from "@nestjs/passport";
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { AuthService } from "./auth.service";

@Injectable()
export class LocalStrategy extends PassportStrategy(
  Strategy,
  "ADDRESSStrategy"
) {
  constructor(private authService: AuthService) {
    super({ usernameField: "address", passwordField: "signature" });
  }

  async validate(address: string, signature: string): Promise<any> {
    const user = await this.authService.validateUser(address, signature);
    if (!user) {
      throw new UnauthorizedException("User not found");
    }
    return user;
  }
}
