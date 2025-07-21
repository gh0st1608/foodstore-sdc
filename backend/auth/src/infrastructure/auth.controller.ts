import { Controller, Post, Body } from '@nestjs/common';
import { LoginUseCase } from '../application/login.application';
import { LoginRequestDto } from '../application/dto/request/login.dto';
import { RegisterRequestDto } from '../application/dto/request/register.dto';
import { RegisterUseCase } from '../application/register.application';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly loginUseCase: LoginUseCase,
    private readonly registerUseCase: RegisterUseCase,
  ) {}

  @Post('login')
  async login(@Body() body: LoginRequestDto) {
    return this.loginUseCase.execute(body);
  }

  @Post('register')
  async register(@Body() body: RegisterRequestDto) {
    return this.registerUseCase.execute(body);
  }

  /* @Post('register')
  async register(
    @Body() body: AuthRegisterDto
  ) {
    return this.registerUseCase.execute(body);
  } */
}
