import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import type { Response } from "express"
import { UsersService } from './users.service';
import { AuthGuard } from '../common/guard/auth.guard';
import { apiResponse } from '../utils';
import type { AuthRequest } from '../types';

@UseGuards(AuthGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Get("profile")
  async handleGetProfile(@Req() req: AuthRequest, @Res() res: Response): Promise<Response> {
    const userId = req.user.id;
    const user = await this.usersService.getProfile(userId)
    return apiResponse(200, { data: user })(res)
  }

}
