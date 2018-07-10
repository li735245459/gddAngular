import { TestBed, inject } from '@angular/core/testing';

import { EmailCodeService } from './email-code.service';

describe('EmailCodeService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [EmailCodeService]
    });
  });

  it('should be created', inject([EmailCodeService], (service: EmailCodeService) => {
    expect(service).toBeTruthy();
  }));
});
