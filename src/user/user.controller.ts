import {
  Body,
  Controller,
  HttpStatus,
  Post,
  Get,
  UseGuards,
  Request,
  Param,
  HttpException,
} from '@nestjs/common'
import {
  ApiCreatedResponse,
  ApiOperation,
  ApiResponse,
  ApiOkResponse,
  ApiQuery,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger'
import { UserService } from './user.service'
import { RegisterUserDto } from './dto/register-user.dto'
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard'
import { LocalAuthGuard } from '../common/guards/local-auth.guard'
import { PasswordHelper } from '../common/helpers/password.helper'
import { IUser } from './interfaces/user.interface'

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(
    private readonly service: UserService,
    private passwordHelper: PasswordHelper,
  ) {}

  @ApiOperation({
    summary: 'Login',
  })
  @ApiOkResponse({
    description: 'User login.',
    type: RegisterUserDto,
  })
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req) {
    return this.service.login(req.user)
  }

  @ApiOperation({
    summary: 'Register',
  })
  @ApiOkResponse({
    description: 'User register.',
    type: RegisterUserDto,
  })
  @Post('register')
  async create(@Body() registerUserDto: RegisterUserDto) {
    const userCheck = await this.service.registerFindUser(
      registerUserDto.userName,
      registerUserDto.email,
    )
    if (userCheck)
      throw new HttpException(
        'REGISTER_EXISTING_USER',
        HttpStatus.INTERNAL_SERVER_ERROR,
      )
    registerUserDto.password = await this.passwordHelper.passwordHash(
      registerUserDto.password,
    )
    await this.service.register(registerUserDto)
  }

  @ApiOperation({
    summary: 'Profile',
  })
  @ApiOkResponse({
    description: 'User profile.',
  })
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getProfile(@Request() req) {
    const userId = req.user.userId
    const user: IUser = await this.service.findUserById(userId)
    return user
  }

  @ApiOperation({
    summary: 'User by Id',
  })
  @ApiOkResponse({
    description: 'User by Id',
  })
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getUserById(@Param('id') id: string) {
    const user: IUser = await this.service.findUserById(id)
    if (!user.id) throw new HttpException('BAD_REQUEST', HttpStatus.BAD_REQUEST)
    return user
  }
}
