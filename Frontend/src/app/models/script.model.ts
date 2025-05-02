import { Status } from './status.model';
import { User } from "./user.model";
import { Bot } from "./bot.model";
import { stat } from 'fs';

export interface Script {
    id: number;
    title: string;
    description: string;
    codeLocationId: string;
    scriptFile: File | null;
    guideLocationId: string;
    guideFile: File | null;
    userId: number;
    user: User | null;
    status: Status | null;
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
        userId: 0,
        user: null,
        status: null,
        userIds: [],
        botIds: []
  };
  }