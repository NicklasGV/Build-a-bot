import { Post } from "./post.model";
import { User } from "./user.model";

export interface Comment {
    id: number;
    user: User;
    post: Post;
    text: string;
    createdAt: Date;
    isDeleted: boolean | null; 
    parentCommentId: number | null;
    replies: Comment[];
    
  }
  
  export function resetComment() {
    return { 
        id: 0, 
        user: [],
        post: [],
        content: '', 
        createdAt: new Date(), 
        updatedAt: new Date(),
        isDeleted: false,
        parentCommentId: null,
        replies: [],
    };
  }