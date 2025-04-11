export interface User {
  id: number;
  userName: string;
  email: string;
  password: string;
  scripts: string[];
  bots: string[];
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