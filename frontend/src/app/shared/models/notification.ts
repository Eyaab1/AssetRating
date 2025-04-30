export class Notification {
    constructor(
      public id: number,
      public content: string,
      public read: boolean,
      public createdAt: Date
    ) {}
  }
  