import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportModelComponent } from './report-model.component';

describe('ReportModelComponent', () => {
  let component: ReportModelComponent;
  let fixture: ComponentFixture<ReportModelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReportModelComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReportModelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
