import type { note } from "./note.entity";

export interface user {
  id: string;
  email: string;
  username: string;
  password: string;
  created_at: Date;
  updated_at: Date;
  notes: note[];
}
