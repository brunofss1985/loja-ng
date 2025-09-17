
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ValidadeAlertaComponent } from './validade-alerta.component';
import { EstoqueService } from '../estoque.service';
import { FormsModule } from '@angular/forms';
import { of } from 'rxjs';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('ValidadeAlertaComponent', () => {
  let component: ValidadeAlertaComponent;
  let fixture: ComponentFixture<ValidadeAlertaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ValidadeAlertaComponent ],
      imports: [ FormsModule, HttpClientTestingModule ],
      providers: [ EstoqueService ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ValidadeAlertaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create component', () => {
    expect(component).toBeTruthy();
  });

  it('should call carregarProdutos and populate produtos', () => {
    const service = TestBed.inject(EstoqueService);
    spyOn(service, 'listarProdutosComValidadeProxima').and.returnValue(of([
      { nome: 'Produto A', marca: 'Marca A', dataValidade: '2025-10-01' }
    ]));

    component.carregarProdutos();

    expect(component.produtos.length).toBeGreaterThan(0);
    expect(component.carregando).toBeFalse();
  });
});
