import { ClassConstructor, plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { NextFunction, Request, Response } from "express";
import { HttpErrors } from "../exceptions/http-errors.factory";

export function validateDtoMiddleware<T extends object>(
  DtoClass: ClassConstructor<T>,
) {
  return async (req: Request, res: Response, next: NextFunction) => {
    const instance = plainToInstance(DtoClass, req.body);

    const errors = await validate(instance, {
      whitelist: true,
      forbidNonWhitelisted: true,
    });

    if (errors.length > 0) {
      const details = errors.map((err) => {
        return {
          property: err.property,
          constraints: err.constraints,
        };
      });

      return next(HttpErrors.badRequest("Validation failed", details));
    }

    req.body = instance;
    next();
  };
}
