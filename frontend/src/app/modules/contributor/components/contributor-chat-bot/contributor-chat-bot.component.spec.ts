import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContributorChatBotComponent } from './contributor-chat-bot.component';

describe('ContributorChatBotComponent', () => {
  let component: ContributorChatBotComponent;
  let fixture: ComponentFixture<ContributorChatBotComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContributorChatBotComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContributorChatBotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
