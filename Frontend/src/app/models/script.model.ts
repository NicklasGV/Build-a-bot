import { User } from "./user.model";
import { Bot } from "./bot.model";

export interface Script {
    id: number;
    title: string;
    description: string;
    codeLocationId: string;
    guideLocationId: string;
    user: User;
    botScripts: Bot[];
    favorites: string[];
  }
  
  export function resetScript() {
    return { 
        id: 0, 
        title: '', 
        description: '',
        codeLocationId: '',
        guideLocationId: '',
        user: [],
        botScripts: [],
        favorites: []
  };
  }