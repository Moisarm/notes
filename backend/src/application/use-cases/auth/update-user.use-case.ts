import type { auth_repository } from "../../../domain/repositories/auth.repository";
import { failure, success } from "../../../domain/result/result-pattern";
import type { update_user_dto } from "../../dto/auth.dto";
import { compare_password_service } from "../../services/auth/compare-passwords.service";
import { decode_token_service } from "../../services/auth/decode-token.service";
import { hash_password_service } from "../../services/auth/hash-password.service";

export class update_user_use_case {
  private readonly auth_repository: auth_repository;
  private readonly decode_token_service: decode_token_service;
  private readonly hash_password_service: hash_password_service;
  private readonly compare_password_service: compare_password_service;

  constructor(auth_repository: auth_repository) {
    this.auth_repository = auth_repository;
    this.decode_token_service = new decode_token_service();
    this.hash_password_service = new hash_password_service();
    this.compare_password_service = new compare_password_service();
  }

  async run(token: string, update_user_data: update_user_dto) {
    try {
      const decoded_token = this.decode_token_service.run(token);
      const user = await this.auth_repository.find_user_by_id(
        decoded_token.user_id,
      );
      if (!user) {
        let fail = {
          status: 404,
          message: "User not found",
          error: "User not found",
        };
        return failure(fail);
      }
      if (update_user_data.password) {
        const user_password = await this.compare_password_service.run(
          update_user_data.password,
          user.password,
        );

        if (user_password.success) {
          let fail = {
            status: 400,
            message: "New password cannot be the same as the old password",
            error: "Bad Request",
          };

          return failure(fail);
        }

        const updated_password = await this.hash_password_service.run(
          update_user_data.password,
        );

        if (updated_password.success) {
          update_user_data = {
            ...update_user_data,
            password: updated_password.data,
          };
        }
      }
      const updated_user = await this.auth_repository.update_user(
        decoded_token.user_id,
        update_user_data,
      );
      return success(updated_user);
    } catch (error) {
      throw error;
    }
  }
}
