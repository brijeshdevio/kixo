import { Body, Controller, Post, Res, UseGuards, UsePipes } from '@nestjs/common';
import type { Response } from "express";
import { AuthService } from './auth.service';
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe';
import { SignupSchema } from './dto/signup.dto';
import { apiResponse } from 'src/utils';
import { LoginSchema } from './dto/login.dto';
import { AuthGuard } from '../common/guard/auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('signup')
  @UsePipes(new ZodValidationPipe(SignupSchema))
  async handleSignup(@Body() body, @Res() res: Response): Promise<Response> {
    const user = await this.authService.signup(body);
    const message = 'User created successfully';
    return apiResponse(201, { data: user, message })(res);
  }

  @Post('login')
  @UsePipes(new ZodValidationPipe(LoginSchema))
  async handleLogin(@Body() body, @Res() res: Response): Promise<Response> {
    const accessToken = await this.authService.login(body);
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      sameSite: 'none',
      secure: true,
      maxAge: 60 * 60 * 1000,
    })
    return apiResponse(200, { rest: { accessToken }, message: "Logged in successfully" })(res);
  }

  @Post("logout")
  @UseGuards(AuthGuard)
  handleLogout(@Res() res: Response): Response {
    res.clearCookie("accessToken")
    return apiResponse(200, { message: "Logged out successfully" })(res);
  }

}
