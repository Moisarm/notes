import express, { type Request, type Response } from "express";
import { health_controller } from "../controllers/health.controller";

export const health_router = express.Router();

const controller = new health_controller();
health_router.get("/", async (req: Request, res: Response) => {
  const response = controller.health();

  res.status(response.status).json(response);
});
