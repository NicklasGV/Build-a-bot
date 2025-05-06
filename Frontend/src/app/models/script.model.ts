import { Status } from './status.model';
import { resetUser, User } from "./user.model";

export interface Script {
    id: number;
    title: string;
    description: string;
    codeLocationId: string;
    scriptFile: File | null;
    guideLocationId: string;
    guideFile: File | null;
    userId: number;
    user: User;
    status: Status | null;
    userIds: number[];
    botIds: number[];
    selected?: boolean;
    content: string | '';
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
        user: resetUser(),
        status: null,
        userIds: [],
        botIds: [],
        content: ''
  };
  }