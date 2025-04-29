import { TestBed } from '@angular/core/testing';

import { TagAndcategoryService } from './tag-andcategory.service';

describe('TagAndcategoryService', () => {
  let service: TagAndcategoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TagAndcategoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
