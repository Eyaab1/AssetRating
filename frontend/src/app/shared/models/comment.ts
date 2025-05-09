export class Comment {
    constructor(
        public id: number,
        public comment: string,
        public userId: string,
        public created_at: Date,
        public likes: number[],
        public replies: Comment[],
        public parentReviewId: number ,
        public userRating?: {
         average: number,
        }
      ) {}
    
      
}

