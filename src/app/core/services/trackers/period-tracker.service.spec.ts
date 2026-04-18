import { TestBed } from '@angular/core/testing';

import { PeriodTrackerService } from './period-tracker.service';

describe('PeriodTrackerService', () => {
  let service: PeriodTrackerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PeriodTrackerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});