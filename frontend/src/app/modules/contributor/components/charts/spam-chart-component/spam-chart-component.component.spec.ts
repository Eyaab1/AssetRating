import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpamChartComponentComponent } from './spam-chart-component.component';

describe('SpamChartComponentComponent', () => {
  let component: SpamChartComponentComponent;
  let fixture: ComponentFixture<SpamChartComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SpamChartComponentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SpamChartComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
