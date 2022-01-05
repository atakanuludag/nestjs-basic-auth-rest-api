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
  const apiPrefix = configService.get<string>('API_PREFIX')
  const apiPort = configService.get<string>('API_PORT')
  const swaggerUrl = configService.get<string>('API_SWAGGER_URL')

  //Swagger
  const config = new DocumentBuilder()
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'Bearer',
        in: 'Header',
      },
      'access-token',
    )
    .setTitle('NetJS Basic Auth Res API')
    .setDescription('Example NestJS auth basic rest api.')
    .setVersion('3.0.3')
    .addServer(apiPrefix)
    .addTag('User', 'User endpoint')
    .addTag('Test', 'Test endpoint')
    .build()
  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup(swaggerUrl, app, document)

  app.setGlobalPrefix(apiPrefix)
  app.useGlobalPipes(new ValidationPipe()) //Dtolarda tanımlanan tüm validasyonları uygulamaya yarar.
  app.enableCors()
  await app.listen(apiPort)
  const appUrl = await app.getUrl()
  console.log(`Application is running on: ${appUrl}`)
  console.log(`Swagger: ${appUrl}/${swaggerUrl}`)
}
bootstrap()
