import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { MongooseModule } from "@nestjs/mongoose";

import { MulterModule } from "@nestjs/platform-express";
import { ServeStaticModule } from "@nestjs/serve-static";

import { configuration } from "./config/configuration";

import { AuthModule } from "./auth/auth.module";
import { UsersModule } from "./users/users.module";
import { User, UserSchema } from "./schemas/user.shema";

const apiPrefix = process.env.API_PREFIX ? `/${process.env.API_PREFIX}` : "";

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `${process.cwd()}/config/env/${process.env.ENV}.env`,
      load: [configuration],
    }),
    MongooseModule.forRoot(`${process.env.DATABASE_URI}?authSource=admin`),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MulterModule.register({ dest: "./upload" }),
    ServeStaticModule.forRoot({
      rootPath: "./upload",
      serveRoot: `${apiPrefix}/upload/`,
    }),
    AuthModule,
    UsersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
