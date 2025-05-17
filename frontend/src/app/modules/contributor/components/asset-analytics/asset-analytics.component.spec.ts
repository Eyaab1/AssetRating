import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetAnalyticsComponent } from './asset-analytics.component';

describe('AssetAnalyticsComponent', () => {
  let component: AssetAnalyticsComponent;
  let fixture: ComponentFixture<AssetAnalyticsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssetAnalyticsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssetAnalyticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
