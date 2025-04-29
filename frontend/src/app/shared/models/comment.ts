export class Comment {
    constructor(
        public id: number,
        public comment: string,
        public userId: string,
        public date: Date,
        public likes: number[],
        public replies: Comment[],
        public parentReviewId: number ,
      ) {}
    
      
}

