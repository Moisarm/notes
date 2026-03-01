import type { note_repository } from "../../../domain/repositories/note.repository";
import { failure, success } from "../../../domain/result/result-pattern";
import type { create_note_dto } from "../../dto/note.dto";
import { decode_token_service } from "../../services/auth/decode-token.service";

export class create_note_use_case {
  private readonly note_repository: note_repository;
  private readonly decode_token_service: decode_token_service;

  constructor(note_repository: note_repository) {
    this.note_repository = note_repository;
    this.decode_token_service = new decode_token_service();
  }

  async run(token: string, data: create_note_dto) {
    try {
      const decoded = this.decode_token_service.run(token);

      const note_data = {
        ...data,
        user_id: decoded.user_id,
      };

      const new_note = await this.note_repository.create_note(note_data);

      return success(new_note);
    } catch (error) {
      return failure(
        error instanceof Error ? error.message : "Failed to create note",
      );
    }
  }
}
