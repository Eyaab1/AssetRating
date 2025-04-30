import { TestBed } from '@angular/core/testing';

import { NotifictaionService } from './notification.service';

describe('NotifictaionService', () => {
  let service: NotifictaionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NotifictaionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
