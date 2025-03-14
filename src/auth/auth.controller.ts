import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';

import { SignInDto } from './dto/sign-in.dto';
import { RefreshToken } from './dto/refresh-token.dto';
import { AuthResponse } from './dto/auth-response.dto';
import { Public } from '../helpers/decorator/public/public.decorator';
import { UserCreateDto } from '../features/user/dto/user-create.dto';

@Controller()
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @Public()
  async login(@Body() payload: SignInDto): Promise<AuthResponse> {
    const response = await this.authService.login(payload);
    return response;
  }

  @Post('sign-up')
  @Public()
  async signUp(@Body() payload: UserCreateDto): Promise<AuthResponse> {
    const response = await this.authService.create(payload);

    return response;
  }

  @Post('refresh-token')
  @Public()
  async refreshToken(@Body() body: RefreshToken): Promise<AuthResponse> {
    const response = await this.authService.refreshTokens(body);

    return response;
  }
}
