import {
  failure,
  success,
  type Result,
} from "../../../domain/result/result-pattern";
import { hash_password } from "../../../infrastructure/external/utils/password-hashing.util";

export class hash_password_service {
  async run(password: string): Promise<Result<string, string>> {
    if (!password) {
      return failure("Empty password");
    }

    const hashed_password: string = await hash_password(password);

    return success(hashed_password);
  }
}
