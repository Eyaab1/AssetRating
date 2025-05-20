import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RatingLevelComponent } from './rating-level.component';

describe('RatingLevelComponent', () => {
  let component: RatingLevelComponent;
  let fixture: ComponentFixture<RatingLevelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RatingLevelComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RatingLevelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
