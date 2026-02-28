import type { note } from "./note.entity";
import type { tag } from "./tag.entity";

export interface note_tag {
  note_id: string;
  tag_id: string;
  created_at: Date;

  // Relations
  note: note;
  tag: tag;
}
