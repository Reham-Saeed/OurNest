import { TestBed } from '@angular/core/testing';

import { BabyCareService } from './baby-care.service';

describe('BabyCareService', () => {
  let service: BabyCareService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BabyCareService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
