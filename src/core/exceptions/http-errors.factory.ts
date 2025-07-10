import { HttpException } from "./http.exception";
import { StatusCodes } from "http-status-codes";

export class HttpErrors {
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
}
