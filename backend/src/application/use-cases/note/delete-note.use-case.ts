import type { note_repository } from "../../../domain/repositories/note.repository";
import { failure, success } from "../../../domain/result/result-pattern";
import { decode_token_service } from "../../services/auth/decode-token.service";

export class delete_note_use_case {
  private readonly note_repository: note_repository;
  private readonly decode_token_service: decode_token_service;

  constructor(note_repository: note_repository) {
    this.note_repository = note_repository;
    this.decode_token_service = new decode_token_service();
  }

  async run(token: string, note_id: string) {
    try {
      const decoded = this.decode_token_service.run(token);

      const note = await this.note_repository.find_by_id(note_id);

      if (!note) {
        return failure("Note not found");
      }

      if (note.user_id !== decoded.user_id) {
        return failure("Unauthorized to delete this note");
      }

      await this.note_repository.delete_note(note_id);

      return success("Note deleted successfully");
    } catch (error) {
      return failure(
        error instanceof Error ? error.message : "Failed to delete note",
      );
    }
  }
}
