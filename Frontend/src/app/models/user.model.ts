export interface User {
  id: string;
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
    id: '', 
    userName: '',
    email: '', 
    password: '',
    scripts: [],
    bots: [],
    favorites: []
};
}