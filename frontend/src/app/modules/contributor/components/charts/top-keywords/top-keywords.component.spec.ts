import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TopKeywordsComponent } from './top-keywords.component';

describe('TopKeywordsComponent', () => {
  let component: TopKeywordsComponent;
  let fixture: ComponentFixture<TopKeywordsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TopKeywordsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TopKeywordsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
