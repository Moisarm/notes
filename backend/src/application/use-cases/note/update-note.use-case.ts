import type { note_repository } from "../../../domain/repositories/note.repository";
import { failure, success } from "../../../domain/result/result-pattern";
import type { update_note_dto } from "../../dto/note.dto";
import { decode_token_service } from "../../services/auth/decode-token.service";

export class update_note_use_case {
  private readonly note_repository: note_repository;
  private readonly decode_token_service: decode_token_service;

  constructor(note_repository: note_repository) {
    this.note_repository = note_repository;
    this.decode_token_service = new decode_token_service();
  }

  async run(token: string, data: update_note_dto) {
    try {
      const decoded = this.decode_token_service.run(token);

      const note = await this.note_repository.find_by_id(data.id);

      if (!note) {
        return failure("Note not found");
      }

      if (note.user_id !== decoded.user_id) {
        return failure("Unauthorized to update this note");
      }

      const updated_note = await this.note_repository.update_note({
        ...data,
      });

      return success(updated_note);
    } catch (error) {
      return failure(
        error instanceof Error ? error.message : "Failed to update note",
      );
    }
  }
}
