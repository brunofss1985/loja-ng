import { TestBed } from '@angular/core/testing';

import { ProdutoLoteService } from './produto-lote.service';

describe('ProdutoLoteService', () => {
  let service: ProdutoLoteService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProdutoLoteService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
