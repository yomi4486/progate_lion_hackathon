import type { RowDataPacket } from "mysql2/promise";

export interface User extends RowDataPacket {
  cognito_user_id: string;
  display_id: string;
  display_name: string;
  bio?: string;
  icon_image_url?: string;
}

export interface UserFollow extends RowDataPacket {
  id: number;
  follower_id: string;
  followed_id: string;
}
