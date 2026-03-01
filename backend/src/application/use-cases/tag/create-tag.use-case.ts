import type { tag_repository } from "../../../domain/repositories/tag.repository";
import { failure, success } from "../../../domain/result/result-pattern";
import type { tag_dto } from "../../dto/tag.dto";

export class create_tag_use_case {
  private readonly tag_repository: tag_repository;

  constructor(tag_repository: tag_repository) {
    this.tag_repository = tag_repository;
  }

  async run(tag: tag_dto) {
    try {
      const existing = await this.tag_repository.find_by_name(tag);

      if (existing) {
        return failure("Tag already exists");
      }

      const new_tag = await this.tag_repository.create(tag);
      return success(new_tag);
    } catch (error) {
      return failure(
        error instanceof Error ? error.message : "Failed to create tag",
      );
    }
  }
}
