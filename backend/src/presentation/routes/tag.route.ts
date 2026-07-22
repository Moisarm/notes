import express, {
  type Request,
  type Response,
  type NextFunction,
} from "express";
import { tag_controller } from "../controllers/tag.controller";
import { tag_repository_implemented } from "../../infrastructure/repositories/tag.repository.implemented";
import { verify } from "../middlewares/server/verify.middleware";

export const tag_router = express.Router();
const tag_repository = new tag_repository_implemented();
const controller = new tag_controller(tag_repository);

// Get all tags
tag_router.get(
  "/",
  verify,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.cookies["Access-Token"];
      const pagination = {
        page: parseInt(req.query.page as string) || 1,
        limit: parseInt(req.query.limit as string) || 10,
      };

      const response = await controller.get_all(token, pagination);
      res.status(response.status).json(response);
    } catch (error) {
      next(error);
    }
  },
);

// Create tag
tag_router.post(
  "/",
  verify,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.cookies["Access-Token"];
      const { name } = req.body;

      if (!name || typeof name !== "string") {
        return res.status(400).json({
          status: 400,
          message: "Tag name is required",
          error: "Bad Request",
        });
      }

      const response = await controller.create(token, name);
      res.status(response.status).json(response);
    } catch (error) {
      next(error);
    }
  },
);

// Delete tag
tag_router.delete(
  "/:id",
  verify,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const tag_id = String(req.params.id);

      const response = await controller.delete(tag_id);
      res.status(response.status).json(response);
    } catch (error) {
      next(error);
    }
  },
);
