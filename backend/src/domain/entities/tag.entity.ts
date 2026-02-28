import type { note } from "./note.entity";
import type { note_tag } from "./note_tag.entity";

export interface tag {
  id: string;
  name: string;
  created_at: Date;

  note_tags: note_tag[];
  notes?: note[];
}
