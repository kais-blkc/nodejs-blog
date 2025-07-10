import { HttpErrors } from "../../core/exceptions/http-errors.factory";
import { PrismaClient, Role, User } from "@prisma/client";
import { UserUpdateDto } from "../users/dto/users.dto";
import { TYPES } from "../../core/di/types";
import { inject } from "inversify";
import bcrypt from "bcrypt";

export class UsersService {
  constructor(
    @inject(TYPES.PrismaClient)
    private readonly prisma: PrismaClient,
  ) {}

  public async findAll(): Promise<User[]> {
    return await this.prisma.user.findMany();
  }

  public async findById(id: string): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw HttpErrors.notFound("User not found");
    }

    return user;
  }

  public async findByEmail(email: string): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw HttpErrors.notFound("User not found");
    }

    return user;
  }

  public async update(id: string, dto: UserUpdateDto): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw HttpErrors.notFound("User not found");
    }

    const hashedPassword = dto.password
      ? await bcrypt.hash(dto.password, 10)
      : user.password;

    return await this.prisma.user.update({
      where: { id },
      data: {
        ...dto,
        password: hashedPassword,
      },
    });
  }

  public async changeRole(id: string, role: Role): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw HttpErrors.notFound("User not found");
    }

    return await this.prisma.user.update({
      where: { id },
      data: { role },
    });
  }
}
