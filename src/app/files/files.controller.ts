import { uploadConfig } from "@/core/config/uploads.config";
import { TYPES } from "@/core/di/types";
import { PaginationDto } from "@/core/dto/pagination.dto";
import { TypedRequestBody } from "@/core/types/request.types";
import { autoBind } from "@/core/utils/autobind";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { inject, injectable } from "inversify";
import { FilesService } from "./files.service";

@injectable()
export class FilesController {
  constructor(
    @inject(TYPES.FilesService) private readonly fileService: FilesService,
  ) {
    autoBind(this);
  }

  async upload(req: Request, res: Response) {
    if (!req.file) return;
    const file = await this.fileService.upload(req.file);
    res.status(StatusCodes.CREATED).json(file);
  }

  async list(req: TypedRequestBody<PaginationDto>, res: Response) {
    const page = parseInt(req.query.page as string) || 1;
    const listSize = parseInt(req.query.list_size as string) || 10;
    const result = await this.fileService.list({ page, list_size: listSize });
    res.status(StatusCodes.OK).json(result);
  }

  async getFile(req: Request, res: Response) {
    const file = await this.fileService.getFile(req.params.id);
    res.status(StatusCodes.OK).json(file);
  }

  async delete(req: Request, res: Response) {
    const file = await this.fileService.delete(req.params.id);
    res.status(StatusCodes.OK).json(file);
  }

  async download(req: Request, res: Response) {
    const file = await this.fileService.getFile(req.params.id);
    res.download(`${file.path}`, file.name);
  }

  async update(req: Request, res: Response) {
    if (!req.file) return;
    const file = await this.fileService.update(req.params.id, req.file);
    res.status(StatusCodes.OK).json(file);
  }
}
