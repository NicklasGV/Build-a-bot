import { Post, resetPost } from "./post.model";
import { resetUser, User } from "./user.model";

export interface Comment {
    id: number;
    user: User;
    post: Post;
    postId: number;
    text: string;
    createdAt: Date;
    isDeleted: boolean | null; 
    parentCommentId: number | null;
    replies: Comment[];
    
  }
  
  export function resetComment() {
    return { 
      id: 0,
      user: resetUser(),
      post: resetPost(),
      postId: 0,
      text: '',
      createdAt: new Date(),
      isDeleted: false,
      parentCommentId: null,
      replies: []
    };
  }