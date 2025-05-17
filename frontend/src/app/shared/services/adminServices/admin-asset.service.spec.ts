import { TestBed } from '@angular/core/testing';

import { AdminAssetService } from './admin-asset.service';

describe('AdminAssetService', () => {
  let service: AdminAssetService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AdminAssetService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
