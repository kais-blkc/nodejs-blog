import { transformResponse } from "../../core/utils/transform-response";
import { UserUpdateDto } from "./dto/users.dto";
import { StatusCodes } from "http-status-codes";
import { UsersService } from "./users.service";
import { TYPES } from "../../core/di/types";
import { Request, Response } from "express";
import { UserRdo } from "./rdo/users.rdo";
import { inject, injectable } from "inversify";
import { autoBind } from "@/core/utils/autobind";

@injectable()
export class UsersController {
  constructor(
    @inject(TYPES.UsersService)
    private readonly usersService: UsersService,
  ) {
    autoBind(this);
  }

  public async findAll(_: Request, res: Response) {
    const users = await this.usersService.findAll();
    res.status(StatusCodes.OK).json(transformResponse(UserRdo, users));
  }

  public async findById(req: Request, res: Response) {
    const { id } = req.params;
    const user = await this.usersService.findById(id);
    res.status(StatusCodes.OK).json(transformResponse(UserRdo, user));
  }

  public async update(req: Request, res: Response) {
    const { id } = req.params;
    const userData = req.body as UserUpdateDto;

    const user = await this.usersService.update(id, userData);
    res.status(StatusCodes.OK).json(transformResponse(UserRdo, user));
  }

  public async changeRole(req: Request, res: Response) {
    const { id } = req.params;
    const { role } = req.body;

    const user = await this.usersService.changeRole(id, role);
    res.status(StatusCodes.OK).json(transformResponse(UserRdo, user));
  }
}
