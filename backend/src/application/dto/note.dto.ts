export interface create_note_dto {
  user_id: string;
  title: string;
  content: string;
  categories_id: string[];
}

export interface update_note_dto {
  title?: string;
  content?: string;
}

export interface note_filter {
  is_archived?: boolean;
  user_id?: string;
  tag_id?: string;
}
