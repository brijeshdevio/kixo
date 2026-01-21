import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import argon from "argon2"
import { PrismaService } from '../prisma/prisma.service';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';


@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService, private readonly jwtService: JwtService) { }

  private async hashPassword(password: string): Promise<string> {
    return await argon.hash(password);
  }

  private async comparePassword(hashedPassword: string, password: string): Promise<boolean> {
    return await argon.verify(hashedPassword, password);
  }

  private async generateToken(payload: any): Promise<string> {
    return await this.jwtService.signAsync(payload);
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

  async login(data: LoginDto): Promise<string> {
    const user = await this.prisma.user.findUnique({ where: { email: data.email } });
    if (!user) {
      throw new NotFoundException(`Invalid Credentials`);
    }

    const isValidPassword = await this.comparePassword(user.password, data.password);
    if (!isValidPassword) {
      throw new NotFoundException(`Invalid Credentials`);
    }

    const accessToken = await this.generateToken({ id: user.id });
    return accessToken
  }
}
