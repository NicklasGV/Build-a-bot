import { Bot } from "./bot.model";
import { Comment } from "./comment.model";
import { Post } from "./post.model";
import { Script, resetScript } from "./script.model";

export interface User {
  id: number;
  discord_id?: number;
  userName: string;
  email: string;
  password: string;
  role?: number;
  scripts: Script[];
  bots: Bot[];
  favorites: string[];
  token?: string;
  posts: Post[];
  comments: Comment[];
}

export function resetUser() {
  return { 
    id: 0,
    userName: '',
    email: '', 
    password: '',
    scripts: [],
    bots: [],
    favorites: [],
    posts: [],
    comments: [],
};
}