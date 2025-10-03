import { uploadConfig } from "@/core/config/uploads.config";
import { TYPES } from "@/core/di/types";
import { PaginationDto } from "@/core/dto/pagination.dto";
import { HttpErrors } from "@/core/exceptions/http-errors.factory";
import { ListRdo } from "@/core/rdo/list.rdo";
import { PrismaClient } from "@prisma/client";
import fs from "fs/promises";
import { inject, injectable } from "inversify";
import path from "path";
import { File as ModelFile } from "@prisma/client";

@injectable()
export class FilesService {
  constructor(
    @inject(TYPES.PrismaClient)
    private readonly prisma: PrismaClient,
  ) {}

  async upload(file: Express.Multer.File): Promise<ModelFile> {
    if (!file) {
      throw HttpErrors.badRequest("File is required");
    }

    const savedFile = await this.prisma.file.create({
      data: {
        name: file.originalname,
        extension: path.extname(file.originalname),
        mimeType: file.mimetype,
        size: file.size,
        path: file.path,
      },
    });
    if (!savedFile) {
      throw HttpErrors.internalServerError("File not saved");
    }

    return savedFile;
  }

  async list({
    page,
    list_size,
  }: Required<PaginationDto>): Promise<ListRdo<ModelFile>> {
    const skip = (page - 1) * list_size;

    const [files, total] = await Promise.all([
      this.prisma.file.findMany({
        skip,
        take: list_size,
        orderBy: { createdAt: "desc" },
      }),
      this.prisma.file.count(),
    ]);
    if (!files) {
      throw HttpErrors.internalServerError("Files not found");
    }

    return {
      total,
      page,
      listSize: list_size,
      data: files,
    };
  }

  async getFile(id: string): Promise<ModelFile> {
    const file = await this.prisma.file.findUnique({
      where: { id },
    });
    if (!file) {
      throw HttpErrors.notFound("File not found");
    }

    return file;
  }

  async delete(id: string): Promise<ModelFile> {
    const file = await this.getFile(id);
    await fs.unlink(path.join(uploadConfig.UPLOAD_DIR, file.path)).catch(() => {
      throw HttpErrors.internalServerError("File not deleted local");
    });

    return this.prisma.file.delete({
      where: { id },
    });
  }

  async update(id: string, newFile: Express.Multer.File): Promise<ModelFile> {
    const oldFile = await this.getFile(id);

    await fs
      .unlink(path.join(uploadConfig.UPLOAD_DIR, oldFile.path))
      .catch(() => {
        throw HttpErrors.internalServerError("File not deleted local");
      });

    const updated = await this.prisma.file.update({
      where: { id },
      data: {
        name: newFile.originalname,
        extension: path.extname(newFile.originalname),
        mimeType: newFile.mimetype,
        size: newFile.size,
        path: newFile.path,
        updatedAt: new Date(),
      },
    });
    if (!updated) {
      throw HttpErrors.internalServerError("File not updated");
    }

    return updated;
  }
}
