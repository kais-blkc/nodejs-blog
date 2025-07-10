import { transformResponse } from "@/core/utils/transform-response";
import { HttpErrors } from "@/core/exceptions/http-errors.factory";
import { TypedRequestBody } from "@/core/types/request.types";
import { TokenRdo, UserRdo } from "../users/rdo/users.rdo";
import { LoginDto, RegisterDto } from "./dto/auth.dto";
import { AuthService } from "../auth/auth.service";
import { StatusCodes } from "http-status-codes";
import { TYPES } from "@/core/di/types";
import { Response } from "express";
import { inject } from "inversify";
import { autoBind } from "@/core/utils/autobind";

export class AuthController {
  constructor(
    @inject(TYPES.AuthService)
    private readonly authService: AuthService,
  ) {
    autoBind(this);
  }

  public async register(req: TypedRequestBody<RegisterDto>, res: Response) {
    if (!req.body) {
      throw HttpErrors.badRequest("Request body is empty");
    }

    const userData = req.body;
    const user = await this.authService.register(userData);

    res.status(StatusCodes.CREATED).json(transformResponse(UserRdo, user));
  }

  public async login(req: TypedRequestBody<LoginDto>, res: Response) {
    if (!req.body) {
      throw HttpErrors.badRequest("Request body is empty");
    }

    const loginData = req.body;
    const user = await this.authService.login(loginData);

    res.status(StatusCodes.OK).json(transformResponse(TokenRdo, user));
  }
}
