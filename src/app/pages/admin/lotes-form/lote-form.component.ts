import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Lote } from 'src/app/core/services/lotesService/lotes.service';

@Component({
  selector: 'app-lote-form',
  templateUrl: './lote-form.component.html',
  styleUrls: ['./lote-form.component.scss'],
})
export class LoteFormComponent implements OnInit, OnChanges {
  @Input() loteToEdit?: Lote;
  @Input() quantidadeTotal: number = 0;

  @Output() loteSalvo = new EventEmitter<Lote>();

  form!: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.createForm();
    if (this.loteToEdit) this.patchForm(this.loteToEdit);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!this.form || !changes['loteToEdit']) return;

    if (this.loteToEdit) {
      this.patchForm(this.loteToEdit);
    } else {
      this.resetForm();
    }
  }

  createForm(): void {
    this.form = this.fb.group({
      id: [null],
      codigo: ['', Validators.required],
      produtoId: [0, Validators.required],
      dataValidade: ['', Validators.required],
      fornecedor: ['', Validators.required],
      contatoVendedor: ['', Validators.required],
      custoPorUnidade: [0, Validators.required],
      valorVendaSugerido: [0, Validators.required],
      notaFiscalEntrada: ['', Validators.required],
      localArmazenamento: ['', Validators.required],
      statusLote: ['ativo', Validators.required],
      dataRecebimento: ['', Validators.required],

      // Novos campos
      custoTotal: [0],
      lucroTotalEstimado: [0],
      lucroEstimadoPorUnidade: [0],
      codigoBarras: [''],
      cnpjFornecedor: [''],
      dataCadastro: [''],
      dataAtualizacao: ['']
    });
  }

  patchForm(lote: Lote): void {
    this.form.patchValue(lote);
  }

  resetForm(): void {
    this.form.reset({
      produtoId: 0,
      custoPorUnidade: 0,
      valorVendaSugerido: 0,
      statusLote: 'ativo',
    });
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const lote: Lote = this.form.getRawValue();
    this.loteSalvo.emit(lote);
    this.resetForm();
  }
}
