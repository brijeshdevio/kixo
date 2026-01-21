import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { User } from '../generated/prisma/client';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) { }

  async getProfile(userId: string): Promise<Omit<User, "password">> {
    const user = await this.prisma.user.findUnique({ where: { id: userId }, omit: { password: true } })
    if (!user) {
      throw new UnauthorizedException('You are not logged in')
    }

    return user;
  }
}
