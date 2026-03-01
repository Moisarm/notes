import express, {
  type Request,
  type Response,
  type NextFunction,
} from "express";
import { note_controller } from "../controllers/note.controller";
import { note_repository_implemented } from "../../infrastructure/repositories/note.repository.implemented";
import { verify } from "../middlewares/server/verify.middleware";
import { validate_class } from "../middlewares/validate-dto.middleware";
import {
  create_note_validation,
  update_note_validation,
} from "../../infrastructure/external/validation/note.validation";
import type {
  create_note_dto,
  update_note_dto,
} from "../../application/dto/note.dto";

export const note_router = express.Router();
const note_repository = new note_repository_implemented();
const controller = new note_controller(note_repository);

// Get all notes (active by default)
note_router.get(
  "/",
  verify,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.cookies["Access-Token"];
      const filters = {
        is_archived: req.query.archived === "true",
        tag_id: (req.query.tag_id as string) || undefined,
      };
      const pagination = {
        page: parseInt(req.query.page as string) || 1,
        limit: parseInt(req.query.limit as string) || 10,
      };

      const response = await controller.get_all(token, filters, pagination);
      res.status(response.status).json(response);
    } catch (error) {
      next(error);
    }
  },
);

// Create note
note_router.post(
  "/",
  verify,
  validate_class(create_note_validation),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.cookies["Access-Token"];
      const data: create_note_dto = req.body;

      const response = await controller.create(token, data);
      res.status(response.status).json(response);
    } catch (error) {
      next(error);
    }
  },
);

// Update note
note_router.put(
  "/:id",
  verify,
  validate_class(update_note_validation),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.cookies["Access-Token"];
      const note_id = req.params.id;
      const data: update_note_dto = req.body;

      const response = await controller.update(token, data);
      res.status(response.status).json(response);
    } catch (error) {
      next(error);
    }
  },
);

// Toggle archive/unarchive
note_router.patch(
  "/:id/archive",
  verify,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.cookies["Access-Token"];
      const note_id = req.params.id as string;

      const response = await controller.toggle_archive(token, note_id);
      res.status(response.status).json(response);
    } catch (error) {
      next(error);
    }
  },
);

// Delete note
note_router.delete(
  "/:id",
  verify,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.cookies["Access-Token"];
      const note_id = req.params.id as string;

      const response = await controller.delete(token, note_id);
      res.status(response.status).json(response);
    } catch (error) {
      next(error);
    }
  },
);
