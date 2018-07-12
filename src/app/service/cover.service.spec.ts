import { TestBed, inject } from '@angular/core/testing';

import { CoverService } from './cover.service';

describe('CoverService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CoverService]
    });
  });

  it('should be created', inject([CoverService], (service: CoverService) => {
    expect(service).toBeTruthy();
  }));
});
