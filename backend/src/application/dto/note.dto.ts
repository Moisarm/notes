export interface create_note_dto {
  title: string;
  content: string;
  tag_ids?: string[];
  user_id: string;
}

export interface update_note_dto {
  id: string;
  title?: string;
  content?: string;
  tag_ids?: string[];
}

export interface note_filter {
  is_archived?: boolean;
  user_id?: string;
  tag_id?: string;
}
