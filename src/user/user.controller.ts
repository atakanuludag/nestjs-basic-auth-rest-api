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
  HttpCode,
} from '@nestjs/common'
import {
  ApiCreatedResponse,
  ApiBadRequestResponse,
  ApiOperation,
  ApiOkResponse,
  ApiTags,
  ApiBody,
  ApiBearerAuth,
} from '@nestjs/swagger'
import { UserService } from './user.service'
import { LoginUserDto } from './dto/login-user.dto'
import { UserDto } from './dto/user.dto'
import { TokenDto } from './dto/token.dto'
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard'
import { LocalAuthGuard } from '../common/guards/local-auth.guard'
import { PasswordHelper } from '../common/helpers/password.helper'
import { IUser } from './interfaces/user.interface'
import { DefaultException } from '../common/classes/default-exception.class'

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
  @ApiBody({ type: LoginUserDto })
  @ApiOkResponse({
    type: TokenDto,
  })
  @UseGuards(LocalAuthGuard)
  @Post('login')
  @HttpCode(200)
  async login(@Request() req) {
    return this.service.login(req.user)
  }

  @ApiOperation({
    summary: 'Register',
  })
  @ApiCreatedResponse({ type: UserDto })
  @ApiBadRequestResponse({ type: DefaultException })
  @Post('register')
  async create(@Body() registerUserDto: UserDto) {
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
    return await this.service.register(registerUserDto)
  }

  @ApiOperation({
    summary: 'Profile',
  })
  @ApiOkResponse({
    type: UserDto,
  })
  @ApiBearerAuth('access-token')
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
    type: UserDto,
  })
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getUserById(@Param('id') id: string) {
    const user: IUser = await this.service.findUserById(id)
    if (!user.id) throw new HttpException('BAD_REQUEST', HttpStatus.BAD_REQUEST)
    return user
  }
}
