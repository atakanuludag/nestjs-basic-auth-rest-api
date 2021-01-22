import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Config } from './app.config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    MongooseModule.forRoot(Config.mongoDbConnectionString),
    UserModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
