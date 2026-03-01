import { verify_token } from "../../../infrastructure/external/utils/jwt.util";

export class decode_token_service {
  run(token: string) {
    const decoded_token = verify_token(token);
    return decoded_token;
  }
}
