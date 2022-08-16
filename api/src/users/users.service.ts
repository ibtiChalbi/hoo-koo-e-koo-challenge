import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { User, UserDocument } from "../schemas/user.shema";
import { Model } from "mongoose";
import { register } from "../dtos/register.dto";
import { generateNonce } from "../utils/nonce";

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async saveUser(data: register): Promise<User | null> {
    try {
      let userData = { ...data, nonce: generateNonce() };
      let newUser = new this.userModel(userData);
      let savedUser = await newUser.save();
      return savedUser;
    } catch (e) {
      console.error("Error from saveUser: ", e);
      return null;
    }
  }

  async findOne(address: string): Promise<User | undefined> {
    return this.userModel.findOne({ address });
  }
}
