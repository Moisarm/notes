import express from "express";
import morgan from "morgan";
import cors from "cors";
import cookieParser from "cookie-parser";
import { config } from "./src/infrastructure/config/server/variables.config";
import { cors_options } from "./src/infrastructure/config/server/cors.config";
import { index_router } from "./src/presentation/routes/index.route";
import { not_found_handler } from "./src/presentation/middlewares/server/404-handler";

const server = express();

//Middlewares
server.use(cors(cors_options));
server.use(morgan("tiny"));
server.use(express.json());
server.use(cookieParser());

server.use("/api", index_router);

server.listen(config.PORT, () => {
  console.log(`Server running on http://localhost:${config.PORT}`);
});

server.use(not_found_handler);
