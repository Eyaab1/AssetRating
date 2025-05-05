import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { onlyGuardGuard } from './only-guard.guard';

describe('onlyGuardGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => onlyGuardGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
