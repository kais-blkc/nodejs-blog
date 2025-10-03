import { IsInt, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class FileUploadDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  extension: string;

  @IsString()
  @IsNotEmpty()
  mimeType: string;

  @IsInt()
  @IsNotEmpty()
  size: number;

  @IsString()
  @IsOptional()
  path?: string;
}
