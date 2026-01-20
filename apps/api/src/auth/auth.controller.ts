import { Body, Controller, Post, Res, UsePipes } from '@nestjs/common';
import type { Response } from "express";
import { AuthService } from './auth.service';
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe';
import { SignupSchema } from './dto/signup.dto';
import { apiResponse } from 'src/utils';

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

}
