import type { user } from "./user.entity";
import type { tag } from "./tag.entity";
import type { note_tag } from "./note_tag.entity";

export interface note {
  id: string;
  title: string;
  content: string;
  is_archived: boolean;
  created_at: Date;
  updated_at: Date;

  user_id: string;
  user: user;

  note_tags: note_tag[];
  tags?: tag[];
}
