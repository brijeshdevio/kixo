import { ConflictException, Injectable } from '@nestjs/common';
import argon from "argon2"
import { PrismaService } from '../prisma/prisma.service';
import { SignupDto } from './dto/signup.dto';

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService) { }

  private async hashPassword(password: string): Promise<string> {
    return await argon.hash(password);
  }

  async signup(data: SignupDto): Promise<void> {
    data.password = await this.hashPassword(data.password);
    try {
      await this.prisma.user.create({ data })
    } catch (error: unknown) {
      const CONFLICT_ERROR_CODE = "P2002";
      const err = error as { code: string }
      if (err?.code === CONFLICT_ERROR_CODE) {
        throw new ConflictException(`User with email ${data.email} already exists`)
      }
      throw error;
    }
  }
}
