import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  UnauthorizedException,
  ValidationPipe,
} from '@nestjs/common';
import { RegisterUserDto, SuccessDto, UserLoginDto } from './dto/user.dto';
import { UserService } from './user.service';

@Controller('auth')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  getHello(): string {
    return this.userService.getHello();
  }

  @Post('/register')
  async registerUser(
    @Body(new ValidationPipe()) registerUserDto: RegisterUserDto,
  ): Promise<any> {
    return this.userService.RegisterUser(registerUserDto);
  }

  @Post('/login')
  @HttpCode(200)
  async loginUser(
    @Body(new ValidationPipe()) userLoginDto: UserLoginDto,
  ): Promise<SuccessDto | UnauthorizedException> {
    return this.userService.LoginUser(userLoginDto);
  }
}
