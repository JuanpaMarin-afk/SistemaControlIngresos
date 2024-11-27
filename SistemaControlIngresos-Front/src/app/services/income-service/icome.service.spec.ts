/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { IcomeService } from './icome.service';

describe('Service: Icome', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [IcomeService]
    });
  });

  it('should ...', inject([IcomeService], (service: IcomeService) => {
    expect(service).toBeTruthy();
  }));
});
