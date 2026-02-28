import express from "express";
import morgan from "morgan";
import cors from "cors";
import cookieParser from "cookie-parser";
import { config } from "./src/infrastructure/config/server/variables.config";
import { cors_options } from "./src/infrastructure/config/server/cors.config";

const server = express();

//Middlewares
server.use(cors(cors_options));
server.use(morgan("tiny"));
server.use(express.json());
server.use(cookieParser());

server.use("/api", () => {});

server.listen(config.PORT, () => {
  console.log(`Server running on http://localhost:${config.PORT}`);
});
