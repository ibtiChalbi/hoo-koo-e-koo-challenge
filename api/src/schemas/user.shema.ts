import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  @Prop({
    required: true,
    unique: true,
  })
  address: string;

  @Prop({
    required: true,
    unique: true,
  })
  nonce: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
