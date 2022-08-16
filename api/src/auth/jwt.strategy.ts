import { PassportStrategy } from "@nestjs/passport";
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ExtractJwt, VerifiedCallback, Strategy } from "passport-jwt";
import { jwtConstants } from "../constant";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, "JWTStrategy") {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtConstants.secret,
    });
  }

  async validate(payload: any, done: VerifiedCallback) {
    if (!payload) {
      done(new UnauthorizedException(), false);
    }
    return done(null, payload);
  }
}
