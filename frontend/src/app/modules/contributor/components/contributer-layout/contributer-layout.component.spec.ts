import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContributerLayoutComponent } from './contributer-layout.component';

describe('ContributerLayoutComponent', () => {
  let component: ContributerLayoutComponent;
  let fixture: ComponentFixture<ContributerLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContributerLayoutComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContributerLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
