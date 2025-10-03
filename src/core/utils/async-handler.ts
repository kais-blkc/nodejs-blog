import { NextFunction, Response, Request } from "express";

type AsyncHandlerParamFn = (
  req: Request,
  res: Response,
  next: NextFunction,
) => Promise<any>;

/**
 * --- Wrapper for async functions in routes (try catch) ---
 */
export const asyncHandler =
  (fn: AsyncHandlerParamFn) =>
  (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
