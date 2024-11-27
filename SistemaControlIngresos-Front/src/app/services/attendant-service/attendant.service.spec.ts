/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { AttendantService } from './attendant.service';

describe('Service: Attendant', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AttendantService]
    });
  });

  it('should ...', inject([AttendantService], (service: AttendantService) => {
    expect(service).toBeTruthy();
  }));
});
