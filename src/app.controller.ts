import { Controller, Get } from '@nestjs/common'
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger'
import { AppService } from './app.service'

@ApiTags('Test')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @ApiOperation({
    summary: 'Test endpoint',
  })
  @ApiOkResponse({
    description: 'Api test.',
  })
  @Get()
  getHello(): string {
    return this.appService.getHello()
  }
}
