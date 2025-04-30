import { User } from "./user.model";
import { Bot } from "./bot.model";

export interface Script {
    id: number;
    title: string;
    description: string;
    codeLocationId: string;
    scriptFile: File | null;
    guideLocationId: string;
    guideFile: File | null;
    userId: number;
    userIds: number[]
    botIds: number[];
  }
  
  export function resetScript() {
    return { 
        id: 0, 
        title: '', 
        description: '',
        codeLocationId: '',
        scriptFile: null,
        guideLocationId: '',
        guideFile: null,
        user: 0,
        userIds: [],
        botIds: []
  };
  }