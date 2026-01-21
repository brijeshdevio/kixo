import { Body, Controller, Get, Post, Req, Res, UseGuards, UsePipes } from '@nestjs/common';
import type { Response } from "express";
import { ChatsService } from './chats.service';
import { AuthGuard } from '../common/guard/auth.guard';
import type { AuthRequest } from '../types';
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe';
import { CreateChatSchema } from './dto/create-chat.dto';
import { apiResponse } from '../utils';

@UseGuards(AuthGuard)
@Controller('chats')
export class ChatsController {
  constructor(private readonly chatsService: ChatsService) { }

  @Post()
  @UsePipes(new ZodValidationPipe(CreateChatSchema))
  async handleCreateChat(@Req() req: AuthRequest, @Body() body, @Res() res: Response): Promise<Response> {
    const userId = req.user.id;
    const chat = await this.chatsService.createChat(userId, body);
    return apiResponse(201, { data: chat })(res)
  }

  @Get()
  async handleGetChats(@Req() req: AuthRequest, @Res() res: Response): Promise<Response> {
    const userId = req.user.id;
    const chats = await this.chatsService.getChats(userId);
    return apiResponse(200, { data: chats })(res)
  }
}
