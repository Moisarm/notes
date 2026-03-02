import type { tag_repository } from "../../../domain/repositories/tag.repository";
import { failure, success } from "../../../domain/result/result-pattern";
import { decode_token_service } from "../../services/auth/decode-token.service";

export class create_tag_use_case {
  private readonly tag_repository: tag_repository;
  private readonly decode_token_service: decode_token_service;

  constructor(tag_repository: tag_repository) {
    this.tag_repository = tag_repository;
    this.decode_token_service = new decode_token_service();
  }

  async run(token: string, name: string) {
    try {
      const decoded = this.decode_token_service.run(token);

      const tag_data = {
        name,
        user_id: decoded.user_id,
      };

      const existing = await this.tag_repository.find_by_name(tag_data);

      if (existing) {
        return failure("Tag already exists");
      }

      const new_tag = await this.tag_repository.create(tag_data);
      return success(new_tag);
    } catch (error) {
      return failure(
        error instanceof Error ? error.message : "Failed to create tag",
      );
    }
  }
}
