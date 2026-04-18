import { TestBed } from '@angular/core/testing';

import { MotherStateService } from './mother-state.service';

describe('MotherStateService', () => {
  let service: MotherStateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MotherStateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
