import { Body, Controller, Get, HttpCode, HttpStatus, Post, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService){}
  
  @UseGuards(JwtAuthGuard)
  @Get('/me')
  getProfile(@Req() req) {
    return this.authService.getProfile(req.user.sub)
  }

  @HttpCode(HttpStatus.OK)
  @Post('/register')
  async signup(@Body() createUserDto: RegisterDto) {
    return await this.authService.signUp(createUserDto);
  }

  @HttpCode(HttpStatus.OK)
  @Post('/login')
  async login(@Body() loginDto: LoginDto) {
    return await this.authService.login(loginDto);
  }
}
