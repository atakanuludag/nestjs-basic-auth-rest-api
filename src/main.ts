import { NestFactory } from '@nestjs/core'
import { ValidationPipe } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'
import { AppModule } from './app.module'
import { IEnv } from './common/interfaces/env.interface'

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: console,
  })
  const configService = app.get<ConfigService<IEnv>>(ConfigService)

  //Swagger
  const config = new DocumentBuilder()
    .setTitle('NetJS Basic Auth Res API')
    .setDescription('Example NestJS auth basic rest api.')
    .setVersion('3.0.3')
    .addTag('User', 'User endpoint')
    .addTag('Test', 'Test endpoint')
    .build()
  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup(
    configService.get<string>('API_SWAGGER_URL'),
    app,
    document,
  )

  app.setGlobalPrefix(configService.get<string>('API_PREFIX'))
  app.useGlobalPipes(new ValidationPipe()) //Dtolarda tanımlanan tüm validasyonları uygulamaya yarar.
  app.enableCors()
  await app.listen(configService.get<string>('API_PORT'))
  console.log(`Application is running on: ${await app.getUrl()}`)
}
bootstrap()
