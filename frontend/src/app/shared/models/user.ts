export class User {
    
    constructor(
        public idUser: string,
        public firstName: string,
        public lastName: string,
        public role: string,
    ){}
  get fullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }
}
