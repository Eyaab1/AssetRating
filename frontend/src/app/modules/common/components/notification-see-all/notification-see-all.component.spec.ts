import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotificationSeeAllComponent } from './notification-see-all.component';

describe('NotificationSeeAllComponent', () => {
  let component: NotificationSeeAllComponent;
  let fixture: ComponentFixture<NotificationSeeAllComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NotificationSeeAllComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NotificationSeeAllComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
