import { TestBed } from '@angular/core/testing';

import {  LoginService } from './login-service.service';

describe('UserServiceService', () => {
  let service: LoginService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LoginService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
