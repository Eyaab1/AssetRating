import { NotificationType } from "../enums/notification-type";

export class Notification {
  constructor(
    public id: String,
    public content: string,
    public read: boolean,
    public createdAt: Date,
    public type: NotificationType,
    public relatedEntityId: string,
    public relatedAssetId: string,
    public actorId: number 
  ) {}
}
