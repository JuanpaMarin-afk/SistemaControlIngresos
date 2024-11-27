/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { ClientServiceService } from './client-service.service';

describe('Service: ClientService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ClientServiceService]
    });
  });

  it('should ...', inject([ClientServiceService], (service: ClientServiceService) => {
    expect(service).toBeTruthy();
  }));
});
