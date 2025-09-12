import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { AuthService } from './core/services/authService/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'loja';

  constructor(
    private authService: AuthService,
    private toastr: ToastrService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.authService.sessionExpired$.subscribe((expired) => {
      if (expired) {
        console.log('⚠️ Sessão expirada detectada — exibindo alerta');

        this.toastr
          .warning(
            'Sua sessão expirou. Deseja fazer login novamente?',
            'Sessão Expirada',
            {
              timeOut: 5000,
              positionClass: 'toast-top-right',
              closeButton: true,
              tapToDismiss: false,
            }
          )
          .onHidden.subscribe(() => {
            this.askToLoginAgain();
            this.authService.resetSessionExpired(); // 👈 Limpa o sinal de expiração

            // ✅ Resetar o estado para não mostrar novamente
            this.authService.resetSessionExpired();
          });
      }
    });
  }

  private askToLoginAgain(): void {
    const confirmReload = confirm('Deseja fazer login novamente?');
    if (confirmReload) {
      const returnUrl = this.authService.getReturnUrl();
      this.router.navigate(['/default-login/login'], {
        queryParams: { returnUrl },
      });
    } else {
      this.router.navigate(['/']);
    }
  }
}
