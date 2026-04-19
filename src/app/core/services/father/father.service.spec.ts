import { TestBed } from '@angular/core/testing';

import { FatherService } from './father.service';

describe('FatherService', () => {
  let service: FatherService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FatherService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
