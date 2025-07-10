import { HttpErrors } from "../../core/exceptions/http-errors.factory";
import { envConfig } from "../../core/config/env.config";
import { LoginDto, RegisterDto } from "./dto/auth.dto";
import { PrismaClient, User } from "@prisma/client";
import { TokenRdo } from "../users/rdo/users.rdo";
import { inject, injectable } from "inversify";
import { TYPES } from "../../core/di/types";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

@injectable()
export class AuthService {
  constructor(
    @inject(TYPES.PrismaClient)
    private readonly prisma: PrismaClient,
  ) {}

  public async register(dto: RegisterDto): Promise<User> {
    const userExists = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (userExists) {
      throw HttpErrors.conflict("User with this email already exists");
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const user = await this.prisma.user.create({
      data: {
        ...dto,
        password: hashedPassword,
      },
    });

    return user;
  }

  public async login(dto: LoginDto): Promise<TokenRdo> {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (!user) {
      throw HttpErrors.unauthorized("User with this email not found");
    }

    if (user.status === "BLOCKED") {
      throw HttpErrors.forbidden("User is blocked");
    }

    const isPasswordMatching = await bcrypt.compare(
      dto.password,
      user.password,
    );

    if (!isPasswordMatching) {
      throw HttpErrors.unauthorized("Password is incorrect");
    }

    const jwtToken = jwt.sign(
      { id: user.id, role: user.role },
      envConfig.jwtSecret,
      {
        expiresIn: envConfig.jwtExpiresIn,
      },
    );

    return {
      token: jwtToken,
    };
  }
}
