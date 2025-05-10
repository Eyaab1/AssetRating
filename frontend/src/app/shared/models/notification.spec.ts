import { Notification } from './notification';
import { NotificationType } from '../enums/notification-type';

describe('Notification', () => {
  it('should create an instance', () => {
    const notif = new Notification(
      1,
      'Test content',
      false,
      new Date(),
      NotificationType.REVIEW_ADDED,
      '123',
      42 // ✅ actorId added here
    );
    expect(notif).toBeTruthy();
  });
});
