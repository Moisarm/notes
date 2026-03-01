import type { User } from "../../../domain/entities/user.entity";
import {
  failure,
  success,
  type Result,
} from "../../../domain/result/result-pattern";
import { Token } from "../../../infrastructure/external/utils/jwt.util";

export class generate_token_service {
  run(user_data: User): Result<string, string> {
    const token = Token({
      user_id: user_data.id,
      username: user_data.username,
      email: user_data.email,
    });

    if (!token) {
      return failure("Error generating token");
    }

    return success(token);
  }
}
