import { HttpErrors } from "../exceptions/http-errors.factory";
import { TokenPayload } from "../interfaces/jwt.interface";
import { NextFunction, Request, Response } from "express";
import { envConfig } from "../config/env.config";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";

export function authMiddlewareFactory(prisma: PrismaClient) {
  return async function authMiddleware(
    req: Request,
    _: Response,
    next: NextFunction,
  ) {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    if (!token) {
      throw HttpErrors.unauthorized("Unauthorized");
    }

    const decoded = verifyAccessToken(token);
    if (!decoded) {
      throw HttpErrors.unauthorized("Unauthorized");
    }

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
    });
    if (!user) {
      throw HttpErrors.notFound("User not found");
    }

    if (user.status === "BLOCKED") {
      throw HttpErrors.forbidden("User is blocked");
    }

    req.user = user;
    next();
  };
}

function verifyAccessToken(token: string): TokenPayload {
  try {
    return jwt.verify(token, envConfig.jwtSecret, {
      ignoreExpiration: false,
    }) as TokenPayload;
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw HttpErrors.unauthorized("Token expired");
    }
    if (error instanceof jwt.JsonWebTokenError) {
      throw HttpErrors.unauthorized("Invalid token");
    }
    if (error instanceof jwt.NotBeforeError) {
      throw HttpErrors.unauthorized("Token not active yet");
    }

    throw HttpErrors.unauthorized("Something went wrong with token");
  }
}

export async function adminMiddleware(
  req: Request,
  _: Response,
  next: NextFunction,
) {
  if (req.user?.role !== "ADMIN") {
    throw HttpErrors.forbidden("Forbidden - Admin access required");
  }

  next();
}

export async function selfOrAdminMiddleware(
  req: Request,
  _: Response,
  next: NextFunction,
) {
  if (req.user?.id !== req.params.id && req.user?.role !== "ADMIN") {
    throw HttpErrors.forbidden("Forbidden - Access denied");
  }
  next();
}
