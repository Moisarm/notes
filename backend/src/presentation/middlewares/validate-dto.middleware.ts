import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import type { NextFunction, Request, RequestHandler, Response } from "express";

export function validate_class<T extends object>(
  dtoClass: new () => T,
): RequestHandler {
  return async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    const body = req.body || {};
    const instance = plainToInstance(dtoClass, body);
    const errors = await validate(instance);

    if (errors.length > 0) {
      const errorMessages = errors.map((err) => ({
        fields: err.property,
        errors: Object.values(err.constraints || {}),
      }));

      res.status(400).json({
        status: 400,
        message: "Validation error",
        errors: errorMessages,
      });

      return;
    }

    req.body = instance;
    next();
  };
}
