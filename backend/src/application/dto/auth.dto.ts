export interface register_dto {
  username: string;
  password: string;
}

export interface user_login_dto {
  username: string;
  password: string;
}

export interface update_user_dto {
  username?: string;
  password?: string;
}
