import { Injectable } from "@nestjs/common";
import { UsersService } from "../users/users.service";
import { checkSignature } from "../utils/nonce";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService
  ) {}

  // used in guard to check if signature valid
  async validateUser(address: string, signature: string): Promise<any> {
    const user = await this.usersService.findOne(address);

    if (user) {
      let isValid = checkSignature(signature, user.nonce);
      if (isValid === user.address.toLowerCase()) {
        return user;
      }
    }
    return null;
  }

  login(data) {
    const payload = {
      user: {
        address: data.address,
        nonce: data.nonce,
      },
    };
    return {
      data,
      access_token: this.jwtService.sign(payload),
    };
  }

  /**
   * if user(address) doesn't exist register : create and return user
   * else return user nonce
   * @param data
   */
  async register(data) {
    let addressData = await this.usersService.findOne(data.address);
    if (addressData) return addressData;
    let response = await this.usersService.saveUser(data);
    if (response) {
      return response;
    }

    return null;
  }

  decodeToken(token): any {
    return this.jwtService.decode(token, { json: true });
  }
}
