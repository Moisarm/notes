import jwt from "jsonwebtoken";
import { config } from "../../config/server/variables.config";

interface payload {
  user_id: string;
  username: string;
}

export const Token = (payload: payload) => {
  return jwt.sign(payload, config.SECRET, { expiresIn: "1h" });
};

export const verify_token = (token: string) => {
  return jwt.verify(token, config.SECRET) as payload;
};
