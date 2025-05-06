import { Comment } from './comment.model';
import { User } from './user.model';

export interface Post {
    id: number;
    user: User | null;
    userId: number;
    title: string;
    content: string;
    createdAt: Date;
    comments: Comment[];
}

export function resetPost() {
    return { 
        id: 0, 
        user: null,
        userId: 0,
        title: '', 
        content: '', 
        createdAt: new Date(), 
        comments: [],
    };
}