import { TestBed } from '@angular/core/testing';

import { HTTPControllerService } from './httpcontroller.service';

describe('HTTPControllerService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: HTTPControllerService = TestBed.get(HTTPControllerService);
    expect(service).toBeTruthy();
  });
});
