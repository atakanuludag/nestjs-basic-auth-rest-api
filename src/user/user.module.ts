import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { Config } from '../app.config';

import { UserController } from './user.controller';
import { User, UserSchema } from './schemas/user.schema';
import { UserService } from './user.service';

import { JwtStrategy } from './strategies/jwt.strategy';
import { LocalStrategy } from './strategies/local.strategy';
import { PasswordHelper } from '../common/helpers/password.helper';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    PassportModule,
    JwtModule.register({
      secret: Config.jwtSecretKey,
      signOptions: { expiresIn: Config.jwtExpiresIn },
    })
  ],
  controllers: [UserController],
  providers: [LocalStrategy, JwtStrategy, PasswordHelper, UserService],
})

export class UserModule {}