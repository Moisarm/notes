import type {
  create_note_dto,
  update_note_dto,
  note_filter,
} from "../../application/dto/note.dto";
import type {
  paginated_result,
  pagination,
} from "../../application/dto/pagination.dto";
import type { note } from "../entities/note.entity";

export interface note_repository {
  find_all(
    filters: note_filter,
    pagination: pagination,
  ): Promise<{ data: note[]; pagination: paginated_result }>;
  find_by_id(id: string): Promise<note | null>;
  create_note(data: create_note_dto): Promise<note>;
  update_note(data: update_note_dto): Promise<note>;
  toggle_note_state(note: note): Promise<note>;
  delete_note(note_id: string): Promise<void>;
}
