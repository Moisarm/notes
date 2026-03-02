import { create_tag_use_case } from "../../application/use-cases/tag/create-tag.use-case";
import { delete_tag_use_case } from "../../application/use-cases/tag/delete-tag.use-case";
import { get_tags_use_case } from "../../application/use-cases/tag/get-tags.use-case";
import type { tag_repository } from "../../domain/repositories/tag.repository";
import type { pagination } from "../../application/dto/pagination.dto";

export class tag_controller {
  private readonly tag_repository: tag_repository;

  constructor(tag_repository_injection: tag_repository) {
    this.tag_repository = tag_repository_injection;
  }

  async get_all(token: string, pagination: pagination) {
    try {
      const use_case = new get_tags_use_case(this.tag_repository);
      const result = await use_case.run(token, pagination);

      if (!result.success) {
        return {
          status: 400,
          message: result.error,
          error: result.error,
        };
      }

      return {
        status: 200,
        message: "Tags retrieved successfully",
        data: {
          items: result.data.data,
          page: result.data.pagination.page,
          limit: result.data.pagination.limit,
          total: result.data.pagination.total,
          total_pages: result.data.pagination.total_pages,
        },
      };
    } catch (error) {
      throw error;
    }
  }

  async create(token: string, name: string) {
    try {
      const use_case = new create_tag_use_case(this.tag_repository);
      const result = await use_case.run(token, name);

      if (!result.success) {
        return {
          status: 400,
          message: result.error,
          error: result.error,
        };
      }

      return {
        status: 201,
        message: "Tag created successfully",
        data: result.data,
      };
    } catch (error) {
      throw error;
    }
  }

  async delete(tag_id: string) {
    try {
      const use_case = new delete_tag_use_case(this.tag_repository);
      const result = await use_case.run(tag_id);

      if (!result.success) {
        return {
          status: 400,
          message: result.error,
          error: result.error,
        };
      }

      return {
        status: 200,
        message: result.data,
      };
    } catch (error) {
      throw error;
    }
  }
}
