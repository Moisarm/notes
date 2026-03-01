import express, {
  type Request,
  type Response,
  type NextFunction,
} from "express";
import { auth_controller } from "../controllers/auth.controller";
import { auth_repository_implemented } from "../../infrastructure/repositories/auth.repository.implemente";
import type {
  register_dto,
  update_user_dto,
  user_login_dto,
} from "../../application/dto/auth.dto";
import { validate_class } from "../middlewares/validate-dto.middleware";
import {
  register_validation,
  update_user_validation,
  user_login_validation,
} from "../../infrastructure/external/validation/auth.validation";
import { verify } from "../middlewares/server/verify.middleware";

export const auth_router = express.Router();
const auth_repository = new auth_repository_implemented();
const controller = new auth_controller(auth_repository);
auth_router.post(
  "/register",
  validate_class(register_validation),
  async (req: Request, res: Response, next: NextFunction) => {
    const user_data: register_dto = req.body;

    console.log("Body: ", user_data);
    try {
      const response = await controller.register(user_data);

      if (response.data?.token) {
        res.cookie("Access-Token", response.data.token, {
          httpOnly: true,
          sameSite: "lax",
          maxAge: 60 * 60 * 1000,
        });
      }
      res.status(response.status).json(response);
    } catch (error) {
      next(error);
    }
  },
);

auth_router.post(
  "/login",
  validate_class(user_login_validation),
  async (req: Request, res: Response, next: NextFunction) => {
    const login_data: user_login_dto = req.body;

    try {
      const response = await controller.login(login_data);

      if (response.data?.token) {
        res.cookie("Access-Token", response.data.token, {
          httpOnly: true,
          sameSite: "lax",
          maxAge: 60 * 60 * 1000,
        });
      }

      res.status(response.status).json(response);
    } catch (error) {
      next(error);
    }
  },
);

auth_router.get(
  "/me",
  verify,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      res.status(200).json({
        status: 200,
        data: { user: req.user },
      });
    } catch (error) {
      next(error);
    }
  },
);

auth_router.put(
  "/update",
  verify,
  validate_class(update_user_validation),
  async (req: Request, res: Response, next: NextFunction) => {
    const update_user_data: update_user_dto = req.body;

    if (!req.body) {
      res.status(400).json({
        status: 400,
        message: `No data provided`,
        error: `Bad Request`,
      });
    }

    try {
      const token = req.cookies["Access-Token"];
      const response = await controller.update(token, update_user_data);

      res.status(response.status).json(response);
    } catch (error) {
      next(error);
    }
  },
);

auth_router.post(
  "/logout",
  verify,
  async (req: Request, res: Response, next: NextFunction) => {
    res.clearCookie("Access-Token", {
      httpOnly: true,
    });

    res.status(200).json({
      status: 200,
      message: "Session Closed",
    });
  },
);

auth_router.delete(
  "/delete",
  verify,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.cookies["Access-Token"];
      const response = await controller.delete_account(token);

      res.status(response.status).json(response);
    } catch (error) {
      next(error);
    }
  },
);
