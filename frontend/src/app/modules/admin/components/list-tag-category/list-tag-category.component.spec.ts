import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListTagCategoryComponent } from './list-tag-category.component';

describe('ListTagCategoryComponent', () => {
  let component: ListTagCategoryComponent;
  let fixture: ComponentFixture<ListTagCategoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListTagCategoryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListTagCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
