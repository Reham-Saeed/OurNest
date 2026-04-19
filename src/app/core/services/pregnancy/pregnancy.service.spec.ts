import { TestBed } from '@angular/core/testing';

import { PregnancyService } from './pregnancy.service';

describe('PregnancyService', () => {
  let service: PregnancyService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PregnancyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
