import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateChatDto } from './dto/create-chat.dto';
import { Chat } from '../generated/prisma/client';

@Injectable()
export class ChatsService {
  constructor(private readonly prisma: PrismaService) { }

  async createChat(userId: string, data: CreateChatDto): Promise<Chat> {
    const newChat = this.prisma.chat.create({
      data: {
        title: data.title,
        userId,
      },
    });
    return newChat;
  }

  async getChats(userId: string): Promise<Omit<Chat, "userId">[]> {
    const chats = await this.prisma.chat.findMany({ where: { userId }, omit: { userId: true } })
    return chats;
  }
}
