import { TestBed } from '@angular/core/testing';

import { ProdutoRealService } from './produto-real.service';

describe('ProdutoRealService', () => {
  let service: ProdutoRealService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProdutoRealService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
