import type { tag_repository } from "../../../domain/repositories/tag.repository";
import { failure, success } from "../../../domain/result/result-pattern";
import type { pagination } from "../../dto/pagination.dto";

export class get_tags_use_case {
  private readonly tag_repository: tag_repository;

  constructor(tag_repository: tag_repository) {
    this.tag_repository = tag_repository;
  }

  async run(pagination: pagination) {
    try {
      const tags = await this.tag_repository.find_all(pagination);
      return success(tags);
    } catch (error) {
      return failure(
        error instanceof Error ? error.message : "Error retrieving messages",
      );
    }
  }
}
