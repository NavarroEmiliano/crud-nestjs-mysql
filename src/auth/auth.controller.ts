import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { AuthGuard } from './guard/auth.guard';
import { RequestWithUser } from './types/userPayload.type';
import { Roles } from './decorators/roles.decorator';
import { RolesGuard } from './guard/roles.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post('login')
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Get('profile')
  @Roles('admin')
  @UseGuards(AuthGuard,RolesGuard)
  profile(@Request() request: RequestWithUser) {
    return this.authService.profile(request.user);
  }
}
