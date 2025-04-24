import { Bot } from "./bot.model";

export interface User {
  id: number;
  discord_id?: number;
  userName: string;
  email: string;
  password: string;
  role?: number;
  scripts: string[];
  bots: Bot[];
  favorites: string[];
  token?: string;
}

export function resetUser() {
  return { 
    id: 0,
    userName: '',
    email: '', 
    password: '',
    scripts: [],
    bots: [],
    favorites: []
};
}