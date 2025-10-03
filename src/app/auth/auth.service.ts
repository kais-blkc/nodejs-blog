import { PrismaClient, User } from "@prisma/client";
import bcrypt from "bcrypt";
import { addDays } from "date-fns";
import { inject, injectable } from "inversify";
import jwt from "jsonwebtoken";
import { envConfig } from "../../core/config/env.config";
import { TYPES } from "../../core/di/types";
import { HttpErrors } from "../../core/exceptions/http-errors.factory";
import { JWTResponseRdo } from "../users/rdo/users.rdo";
import { LoginDto, RegisterDto } from "./dto/auth.dto";

@injectable()
export class AuthService {
  constructor(
    @inject(TYPES.PrismaClient)
    private readonly prisma: PrismaClient,
  ) {}

  public async register(dto: RegisterDto): Promise<JWTResponseRdo> {
    const userExists = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });
    if (userExists) {
      throw HttpErrors.conflict("User with this email already exists");
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        password: hashedPassword,
      },
    });

    const accessToken = this.generateAccessToken(user);
    const refreshToken = this.generateRefreshToken(user);

    return { accessToken, refreshToken };
  }

  public async login(dto: LoginDto): Promise<JWTResponseRdo> {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });
    if (!user) {
      throw HttpErrors.badRequest("User with this email not found");
    }
    if (user.status === "BLOCKED") {
      throw HttpErrors.forbidden("User is blocked");
    }

    const isPasswordMatching = await bcrypt.compare(
      dto.password,
      user.password,
    );
    if (!isPasswordMatching) {
      throw HttpErrors.badRequest("Password is incorrect");
    }

    const accessToken = this.generateAccessToken(user);
    const refreshToken = this.generateRefreshToken(user);

    await this.prisma.refreshToken.create({
      data: {
        token: refreshToken,
        userId: user.id,
        expiresAt: addDays(new Date(), 7),
      },
    });

    return { accessToken, refreshToken };
  }

  public async refreshToken(refreshToken: string): Promise<JWTResponseRdo> {
    try {
      const decoded = jwt.verify(refreshToken, envConfig.jwtRefreshSecret) as {
        id: string;
      };
      const storedToken = await this.prisma.refreshToken.findUnique({
        where: { token: refreshToken },
      });
      if (!storedToken || storedToken.expiresAt < new Date()) {
        throw HttpErrors.unauthorized("Refresh token expired or invalid");
      }

      const user = await this.prisma.user.findUnique({
        where: { id: decoded.id },
      });
      if (!user) throw HttpErrors.unauthorized("User not found");

      const newAccessToken = this.generateAccessToken(user);
      const newRefreshToken = this.generateRefreshToken(user);

      await this.prisma.refreshToken.update({
        where: { token: refreshToken },
        data: {
          token: newRefreshToken,
          expiresAt: addDays(new Date(), 7),
        },
      });

      return { accessToken: newAccessToken, refreshToken: newRefreshToken };
    } catch (error) {
      throw HttpErrors.unauthorized("Invalid refresh token");
    }
  }

  public async logout(refreshToken: string): Promise<void> {
    await this.prisma.refreshToken.deleteMany({
      where: { token: refreshToken },
    });
  }

  private generateAccessToken(user: User) {
    return jwt.sign({ id: user.id, role: user.role }, envConfig.jwtSecret, {
      expiresIn: envConfig.jwtExpiresIn,
    });
  }

  private generateRefreshToken(user: User) {
    return jwt.sign({ id: user.id }, envConfig.jwtRefreshSecret, {
      expiresIn: envConfig.jwtRefreshExpiresIn,
    });
  }
}
