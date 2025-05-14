import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportAComponent } from './report-a.component';

describe('ReportAComponent', () => {
  let component: ReportAComponent;
  let fixture: ComponentFixture<ReportAComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReportAComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReportAComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
