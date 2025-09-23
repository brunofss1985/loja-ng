import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LotesService, Lote } from 'src/app/core/services/lotesService/lotes.service';
import { ToastrService } from 'ngx-toastr';
import { LoteFormComponent } from '../lotes-form/lote-form.component';

@Component({
  selector: 'app-edit-lote-eproduto-lote',
  templateUrl: './edit-lote-eproduto-lote.component.html',
  styleUrls: ['./edit-lote-eproduto-lote.component.scss']
})
export class EditLoteEProdutoLoteComponent implements OnInit {
  @ViewChild(LoteFormComponent) loteFormComponent!: LoteFormComponent;

  lote?: Lote;
  loading: boolean = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private loteService: LotesService,
    private toast: ToastrService
  ) {}

  ngOnInit(): void {
    const id = +this.route.snapshot.paramMap.get('id')!;
    this.loteService.buscarPorId(id).subscribe({
      next: (data) => {
        this.lote = data;
        this.loading = false;
      },
      error: () => {
        this.toast.error('Erro ao carregar lote.');
        this.router.navigate(['/lotes']);
      }
    });
  }

  salvar(): void {
    this.loteFormComponent.submit();
  }

  onLoteSalvo(loteEditado: Lote): void {
    this.loteService.atualizar(loteEditado.id!, loteEditado).subscribe({
      next: () => {
        this.toast.success('Lote atualizado com sucesso!');
        this.router.navigate(['/lotes']);
      },
      error: () => {
        this.toast.error('Erro ao atualizar lote.');
      }
    });
  }

  voltar(): void {
    this.router.navigate(['/lotes']);
  }
}
