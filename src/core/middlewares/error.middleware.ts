import { HttpException } from "../exceptions/http.exception";
import { NextFunction, Request, Response } from "express";

export function errorMiddleware(
  err: HttpException | Error,
  req: Request,
  res: Response,
  next: NextFunction,
) {
  if (err instanceof HttpException) {
    res.status(err.status).json(err.toJson());
  } else {
    console.error("ErrorMiddleware: ", err);
    res.status(500).json({
      status: 500,
      message: err.message,
    });
  }
}
