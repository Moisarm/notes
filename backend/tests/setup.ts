import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import { index_router } from "../src/presentation/routes/index.route";

const app = express();
app.use(cors({ origin: "*", credentials: true }));
app.use(express.json());
app.use(cookieParser());
app.use("/api", index_router);

export { app };
