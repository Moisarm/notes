import type { note_repository } from "../../../domain/repositories/note.repository";
import { failure, success } from "../../../domain/result/result-pattern";
import { decode_token_service } from "../../services/auth/decode-token.service";
import type { pagination } from "../../dto/pagination.dto";
import type { note_filter } from "../../dto/note.dto";

export class get_notes_use_case {
  private readonly note_repository: note_repository;
  private readonly decode_token_service: decode_token_service;

  constructor(note_repository: note_repository) {
    this.note_repository = note_repository;
    this.decode_token_service = new decode_token_service();
  }

  async run(token: string, filters: note_filter, pagination: pagination) {
    try {
      const decoded = this.decode_token_service.run(token);

      const notes = await this.note_repository.find_all(
        { ...filters, user_id: decoded.user_id },
        pagination,
      );

      return success(notes);
    } catch (error) {
      return failure(
        error instanceof Error ? error.message : "Failed to get notes",
      );
    }
  }
}
