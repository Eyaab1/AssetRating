export class Rating {

    constructor(
        public id: string,
        public functionality: number,
        public performance: number,
        public easeOfIntegration: number,
        public documentationQuality: number,
        public timestamp: Date,
        public userId: string,
        
    ){}
    // Example method to calculate the average rating   
    getAverageRating(): number {
        const total = this.functionality + this.performance + this.easeOfIntegration + this.documentationQuality;
        return total / 4;
    }
    
    
    
}
