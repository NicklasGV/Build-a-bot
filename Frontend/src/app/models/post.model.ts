import { Comment } from './comment.model';
import { resetUser, User } from './user.model';

export interface Post {
    id: number;
    user: User;
    userId: number;
    title: string;
    content: string;
    createdAt: Date;
    comments: Comment[];
}

export function resetPost() {
    return { 
        id: 0, 
        user: resetUser(),
        userId: 0,
        title: '', 
        content: '', 
        createdAt: new Date(), 
        comments: [],
    };
}