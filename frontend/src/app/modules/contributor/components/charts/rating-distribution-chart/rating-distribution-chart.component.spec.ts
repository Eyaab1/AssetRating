import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RatingDistributionChartComponent } from './rating-distribution-chart.component';

describe('RatingDistributionChartComponent', () => {
  let component: RatingDistributionChartComponent;
  let fixture: ComponentFixture<RatingDistributionChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RatingDistributionChartComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RatingDistributionChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
