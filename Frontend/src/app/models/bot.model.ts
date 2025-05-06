import { Script } from "./script.model";
import { resetUser, User } from "./user.model";

export interface Bot {
    id: number;
    name: string;
    user: User;
    botScripts: Script[];
  }
  
  export function resetBot() {
    return { 
        id: 0, 
        name: '',
        user: resetUser(),
        botScripts: [],
  };
  }