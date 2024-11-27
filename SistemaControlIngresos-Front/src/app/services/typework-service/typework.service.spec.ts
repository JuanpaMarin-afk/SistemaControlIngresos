/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { TypeworkService } from './typework.service';

describe('Service: Typework', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TypeworkService]
    });
  });

  it('should ...', inject([TypeworkService], (service: TypeworkService) => {
    expect(service).toBeTruthy();
  }));
});
