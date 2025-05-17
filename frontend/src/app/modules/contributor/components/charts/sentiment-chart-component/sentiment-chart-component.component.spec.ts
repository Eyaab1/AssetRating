import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SentimentChartComponentComponent } from './sentiment-chart-component.component';

describe('SentimentChartComponentComponent', () => {
  let component: SentimentChartComponentComponent;
  let fixture: ComponentFixture<SentimentChartComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SentimentChartComponentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SentimentChartComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
