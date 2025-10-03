import { Expose } from "class-transformer";

export class FileRdo {
  @Expose()
  id: string;

  @Expose()
  name: string;

  @Expose()
  extension: string;

  @Expose()
  mimeType: string;

  @Expose()
  size: number;

  @Expose()
  path: string;

  @Expose()
  createdAt: string;

  @Expose()
  updatedAt: string;
}
