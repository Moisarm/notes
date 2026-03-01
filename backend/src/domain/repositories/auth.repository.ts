import type {
  register_dto,
  update_user_dto,
} from "../../application/dto/auth.dto";
import type { user } from "../entities/user.entity";

export interface auth_repository {
  register(user_data: register_dto): Promise<user>;
  find_user_by_username(username: string): Promise<user | null>;
  find_user_by_id(id: string): Promise<user>;
  update_user(user_id: string, user_data: update_user_dto): Promise<user>;
  delete_account(user_id: string): Promise<null>;
}
