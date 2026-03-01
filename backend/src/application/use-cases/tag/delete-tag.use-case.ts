import type { tag_repository } from "../../../domain/repositories/tag.repository";
import { failure, success } from "../../../domain/result/result-pattern";

export class delete_tag_use_case {
  private readonly tag_repository: tag_repository;

  constructor(tag_repository: tag_repository) {
    this.tag_repository = tag_repository;
  }

  async run(tag_id: string) {
    try {
      const tag = await this.tag_repository.find_by_id(tag_id);
      if (!tag) {
        return failure("Tag not found");
      }

      await this.tag_repository.delete(tag_id);
      return success("Tag deleted successfully");
    } catch (error) {
      return failure(
        error instanceof Error ? error.message : "Failed to delete tag",
      );
    }
  }
}
