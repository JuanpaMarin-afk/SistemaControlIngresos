/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { ClientTypeServiceService } from './client-type-service.service';

describe('Service: ClientTypeService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ClientTypeServiceService]
    });
  });

  it('should ...', inject([ClientTypeServiceService], (service: ClientTypeServiceService) => {
    expect(service).toBeTruthy();
  }));
});
