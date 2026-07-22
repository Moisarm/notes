import type {
  register_dto,
  update_user_dto,
  user_login_dto,
} from "../../application/dto/auth.dto";
import { delete_user_use_case } from "../../application/use-cases/auth/delete-user.use-case";
import { login_use_case } from "../../application/use-cases/auth/login.use-case";
import { register_use_case } from "../../application/use-cases/auth/register.use-case";
import { update_user_use_case } from "../../application/use-cases/auth/update-user.use-case";
import type { user } from "../../domain/entities/user.entity";
import type { auth_repository } from "../../domain/repositories/auth.repository";

export class auth_controller {
  private readonly auth_repository: auth_repository;

  constructor(auth_repository_injection: auth_repository) {
    this.auth_repository = auth_repository_injection;
  }

  async register(user_data: register_dto) {
    try {
      const register = new register_use_case(this.auth_repository);
      const new_user = await register.run(user_data);

      if (!new_user.success) {
        return {
          status: 400,
          message: new_user.error,
          error: new_user.error,
        };
      }

      return {
        status: 201,
        message: "User Registered",
        data: new_user.data,
      };
    } catch (error) {
      throw error;
    }
  }

  async login(login_data: user_login_dto) {
    const login = new login_use_case(this.auth_repository);

    try {
      const response = await login.run(login_data);

      if (!response.success) {
        return {
          status: 400,
          message: response.error,
          error: response.error,
        };
      }

      const public_user: Partial<user> = {
        username: response.data.user.username,
      };

      let data = {
        user: public_user,
        token: response.data.token,
      };
      return {
        status: 200,
        message: `Welcome ${response.data.user.username}`,
        data,
      };
    } catch (error) {
      throw error;
    }
  }

  async update(token: string, update_user_data: update_user_dto) {
    const update = new update_user_use_case(this.auth_repository);
    try {
      const response = await update.run(token, update_user_data);
      if (!response.success) {
        const err = response.error as any;
        return {
          status: err?.status || 400,
          message: err?.message || err || "Update failed",
          error: err?.error || "Bad Request",
        };
      }

      return {
        status: 201,
        message: `${response.data.username} updated successfully`,
        data: response.data,
      };
    } catch (error) {
      throw error;
    }
  }

  async delete_account(token: string) {
    try {
      const _delete = new delete_user_use_case(this.auth_repository);
      const response = await _delete.run(token);

      if (!response.success) {
        return {
          status: 500,
          message: response.error,
        };
      }
      return {
        status: 200,
        message: response.data,
      };
    } catch (error) {
      throw error;
    }
  }
}
