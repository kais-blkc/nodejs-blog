import { Role, Status } from "@prisma/client";
import { Transform } from "class-transformer";
import {
  IsOptional,
  MinLength,
  IsString,
  IsEmail,
  IsDate,
  IsEnum,
} from "class-validator";

export class UserUpdateDto {
  @IsString()
  @IsOptional()
  firstName?: string;

  @IsString()
  @IsOptional()
  lastName?: string;

  @IsString()
  @IsOptional()
  middleName?: string;

  @IsDate()
  @IsOptional()
  @Transform(({ value }) => new Date(value))
  birthDate?: Date;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @MinLength(6)
  @IsOptional()
  password?: string;

  @IsEnum(Status)
  @IsOptional()
  status?: Status;
}

export class UserUpdateRoleDto {
  @IsEnum(Role)
  role: Role;
}
