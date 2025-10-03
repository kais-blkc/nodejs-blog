import { IsNotEmpty, IsString } from "class-validator";

export class JwtRefreshDto {
  @IsString()
  @IsNotEmpty()
  refreshToken: string;
}
