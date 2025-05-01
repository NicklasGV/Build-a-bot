import { resetUser, User } from "./user.model";
import { Bot } from "./bot.model";

export interface Script {
  user: User;
  id: number;
  title: string;
  description: string;
  codeLocationId: string;
  scriptFile: File | null;
  guideLocationId: string;
  guideFile: File | null;
  StatusId?: number;
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
        user: resetUser(),
        userIds: [],
        botIds: []
  };
  }