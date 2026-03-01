import {
  failure,
  success,
  type Result,
} from "../../../domain/result/result-pattern";
import { compare_passwords } from "../../../infrastructure/external/utils/password-hashing.util";

export class compare_password_service {
  async run(
    password: string,
    hashed_password: string
  ): Promise<Result<string, string>> {
    const pass = await compare_passwords(password, hashed_password);

    if (!pass) {
      return failure("Wrong password");
    }

    return success("Acces Granted");
  }
}
