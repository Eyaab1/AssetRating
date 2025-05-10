import { NotificationType } from "../enums/notification-type";

export class Notification {
  constructor(
    public id: number,
    public content: string,
    public read: boolean,
    public createdAt: Date,
    public type: NotificationType,
    public relatedEntityId: string,
    public actorId: number 
  ) {}
}
