
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MovimentacoesComponent } from './movimentacoes.component';
import { EstoqueService } from '../estoque.service';
import { of } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('MovimentacoesComponent', () => {
  let component: MovimentacoesComponent;
  let fixture: ComponentFixture<MovimentacoesComponent>;
  let estoqueService: jasmine.SpyObj<EstoqueService>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MovimentacoesComponent ],
      imports: [ FormsModule, HttpClientTestingModule ],
      providers: [ EstoqueService ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MovimentacoesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create component', () => {
    expect(component).toBeTruthy();
  });

  it('should call buscarMovimentacoes and return results', () => {
    const service = TestBed.inject(EstoqueService);
    spyOn(service, 'buscarPorLote').and.returnValue(of([
      { id: 1, produtoId: 101, tipo: 'ENTRADA', quantidade: 10, lote: 'L123', dataMovimentacao: '2025-09-10' }
    ]));

    component.lote = 'L123';
    component.buscarMovimentacoes();

    expect(component.movimentacoes.length).toBe(1);
    expect(component.carregando).toBeFalse();
  });
});
