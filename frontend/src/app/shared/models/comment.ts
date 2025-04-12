export class Comment {
    constructor(
        public idComment: string,
        public date: Date,
        public fullDescription: string,
        public userId: string,
      ) {}
    
      // Example method to toggle the expanded state
      // toggleExpanded(): void {
      //   this.expanded = !this.expanded;
      // }
    
      // Example method to get a formatted summary of the comment
      getSummary(): string {
        return `(${this.date}): ${this.fullDescription.substring(0, 50)}...`;
      }
}

