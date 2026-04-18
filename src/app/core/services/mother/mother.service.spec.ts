import { TestBed } from '@angular/core/testing';

import { MotherService } from './mother.service';

describe('MotherService', () => {
  let service: MotherService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MotherService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
