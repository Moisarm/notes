import type { note } from "./note.entity";

export interface user {
  id: string;
  username: string;
  password: string;
  created_at: Date;
  updated_at: Date;
  notes: note[];
}
