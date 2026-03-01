import type {
  register_dto,
  update_user_dto,
} from "../../application/dto/auth.dto";
import type { user } from "../../domain/entities/user.entity";
import type { auth_repository } from "../../domain/repositories/auth.repository";
import { prisma } from "../config/database/prisma.config";

export class auth_repository_implemented implements auth_repository {
  async register(user_data: register_dto): Promise<user> {
    const new_user = await prisma.user.create({
      data: {
        username: user_data.username,
        password: user_data.password,
      },
    });

    return new_user as unknown as user;
  }

  async find_user_by_username(username: string): Promise<user | null> {
    const found_user = await prisma.user.findUnique({
      where: { username },
      include: { notes: true },
    });

    if (!found_user) {
      return null;
    }

    return found_user as unknown as user;
  }

  async find_user_by_id(id: string): Promise<user> {
    const found_user = await prisma.user.findUnique({
      where: { id },
      include: { notes: true },
    });

    if (!found_user) {
      throw new Error("User not found");
    }

    return found_user as unknown as user;
  }

  async update_user(
    user_id: string,
    user_data: update_user_dto,
  ): Promise<user> {
    const updated_user = await prisma.user.update({
      where: { id: user_id },
      data: {
        ...user_data,
        updated_at: new Date(),
      },
      include: { notes: true },
    });

    return updated_user as unknown as user;
  }

  async delete_account(user_id: string): Promise<null> {
    await prisma.user.delete({
      where: { id: user_id },
    });

    return null;
  }
}
