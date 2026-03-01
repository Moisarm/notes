import type { NextFunction, Request, Response } from "express";
import { verify_token } from "../../../infrastructure/external/utils/jwt.util";

declare module "express-serve-static-core" {
  interface Request {
    user?: {
      user_id: string;
      username: string;
      email: string;
    };
  }
}

export const verify = (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.cookies["Access-Token"];

    if (!token) {
      return res.status(401).json({
        status: 401,
        message: "Access token is missing...",
        error: "Unauthorized",
      });
    }

    const data = verify_token(token);

    req.user = data;
  } catch (error) {
    console.error("Error en validacion de token:");

    return res.status(401).json({
      status: 401,
      message: "Invalid or expired token",
      error: "Unauthorized",
    });
  }

  next();
};
