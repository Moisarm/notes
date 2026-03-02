import type { tag_repository } from "../../../domain/repositories/tag.repository";
import { failure, success } from "../../../domain/result/result-pattern";
import type { pagination } from "../../dto/pagination.dto";
import { decode_token_service } from "../../services/auth/decode-token.service";

export class get_tags_use_case {
  private readonly tag_repository: tag_repository;
  private readonly decode_token_service: decode_token_service;

  constructor(tag_repository: tag_repository) {
    this.tag_repository = tag_repository;
    this.decode_token_service = new decode_token_service();
  }

  async run(token: string, pagination: pagination) {
    try {
      const decoded = this.decode_token_service.run(token);
      const tags = await this.tag_repository.find_all(decoded.user_id, pagination);
      return success(tags);
    } catch (error) {
      return failure(
        error instanceof Error ? error.message : "Error retrieving messages",
      );
    }
  }
}
