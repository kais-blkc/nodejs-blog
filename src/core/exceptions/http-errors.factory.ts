import { StatusCodes } from "http-status-codes";
import { HttpException } from "./http.exception";

export class HttpErrors {
  // 400
  static badRequest(message = "Bad request", details?: object) {
    return new HttpException(StatusCodes.BAD_REQUEST, message, details);
  }

  // 401
  static unauthorized(message = "Unauthorized", details?: object) {
    return new HttpException(StatusCodes.UNAUTHORIZED, message, details);
  }

  // 403
  static forbidden(message = "Forbidden", details?: object) {
    return new HttpException(StatusCodes.FORBIDDEN, message, details);
  }

  // 404
  static notFound(message = "Not Found", details?: object) {
    return new HttpException(StatusCodes.NOT_FOUND, message, details);
  }

  // 409
  static conflict(message = "Conflict", details?: object) {
    return new HttpException(StatusCodes.CONFLICT, message, details);
  }

  // 500
  static internalServerError(
    message = "Internal Server Error",
    details?: object,
  ) {
    return new HttpException(
      StatusCodes.INTERNAL_SERVER_ERROR,
      message,
      details,
    );
  }
}
