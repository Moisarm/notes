import express from "express";
import { auth_router } from "./auth.route";
import { health_router } from "./health.route";
import { note_router } from "./note.route";
import { tag_router } from "./tag.route";

export const index_router = express.Router();

index_router.use("/", health_router);
index_router.use("/auth", auth_router);
index_router.use("/note", note_router);
index_router.use("/tag", tag_router);
