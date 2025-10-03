import { TYPES } from "@/core/di/types";
import { TypedRequestBody } from "@/core/types/request.types";
import { autoBind } from "@/core/utils/autobind";
import { transformResponse } from "@/core/utils/transform-response";
import { Response } from "express";
import { StatusCodes } from "http-status-codes";
import { inject, injectable } from "inversify";
import { AuthService } from "../auth/auth.service";
import { JWTResponseRdo } from "../users/rdo/users.rdo";
import { LoginDto, RegisterDto } from "./dto/auth.dto";
import { JwtRefreshDto } from "./dto/jwt-refresh.dto";

@injectable()
export class AuthController {
  constructor(
    @inject(TYPES.AuthService)
    private readonly authService: AuthService,
  ) {
    autoBind(this);
  }

  public async register(req: TypedRequestBody<RegisterDto>, res: Response) {
    const userData = req.body;
    const jwtToken = await this.authService.register(userData);

    res
      .status(StatusCodes.CREATED)
      .json(transformResponse(JWTResponseRdo, jwtToken));
  }

  public async login(req: TypedRequestBody<LoginDto>, res: Response) {
    const loginData = req.body;
    const jwtToken = await this.authService.login(loginData);

    res
      .status(StatusCodes.OK)
      .json(transformResponse(JWTResponseRdo, jwtToken));
  }

  public async refreshToken(
    req: TypedRequestBody<JwtRefreshDto>,
    res: Response,
  ) {
    const { refreshToken } = req.body;
    const newJwt = await this.authService.refreshToken(refreshToken);
    res.status(StatusCodes.OK).json(transformResponse(JWTResponseRdo, newJwt));
  }

  public async logout(req: TypedRequestBody<JwtRefreshDto>, res: Response) {
    await this.authService.logout(req.body.refreshToken);
    res.status(StatusCodes.NO_CONTENT).send();
  }
}
