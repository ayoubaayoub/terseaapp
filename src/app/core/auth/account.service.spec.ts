import { TestBed } from '@angular/core/testing';

import { AccountService } from './account.service';
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {SessionStorageService} from "ngx-webstorage";

describe('AccountService', () => {
  let service: AccountService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [SessionStorageService]
    });
    service = TestBed.inject(AccountService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
