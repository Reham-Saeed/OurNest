import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { motherStateGuard } from './mother-state.guard';

describe('motherStateGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => motherStateGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
