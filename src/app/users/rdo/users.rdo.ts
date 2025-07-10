import { Exclude, Expose } from "class-transformer";

export class UserRdo {
  @Expose()
  id: number;
  @Expose()
  firstName: string;
  @Expose()
  lastName: string;
  @Expose()
  middleName?: string;
  @Expose()
  birthDate: Date;
  @Expose()
  email: string;
  @Expose()
  role: string;
  @Expose()
  status: string;
  @Expose()
  createdAt: Date;
  @Expose()
  updatedAt: Date;

  @Exclude()
  password: string;
}

export class TokenRdo {
  @Expose()
  token: string;
}
