import {
  Component,
  OnInit,
  AfterViewInit,
  ChangeDetectorRef,
  NgZone,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/core/services/authService/auth.service';
import { CartService } from 'src/app/core/services/cartService/cart-service.service';

declare global {
  interface Window {
    handleGoogleLogin: (response: any) => void;
  }
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit, AfterViewInit {
  loginForm: FormGroup = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(6),
    ]),
  });

  errorMessage: string = '';
  isLoading: boolean = false;
  isGoogleLoading: boolean = false;
  googleScriptLoaded: boolean = false;
  returnUrl: string = '/';

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private toastService: ToastrService,
    private authService: AuthService,
    private cartService: CartService,
    private cdr: ChangeDetectorRef,
    private ngZone: NgZone
  ) {}

  ngOnInit(): void {
    window.handleGoogleLogin = this.handleGoogleLogin.bind(this);
    this.returnUrl =
      this.route.snapshot.queryParamMap.get('returnUrl') ||
      this.authService.getReturnUrl() ||
      '/';
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.loadGoogleScript().then(() => {
        this.initGoogleAuth();
      });
    }, 300);
  }

  loadGoogleScript(): Promise<void> {
    return new Promise((resolve) => {
      if (this.googleScriptLoaded || (window as any).google) {
        this.googleScriptLoaded = true;
        resolve();
        return;
      }

      const existingScript = document.querySelector(
        'script[src*="accounts.google.com"]'
      );
      if (existingScript) {
        existingScript.remove();
      }

      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;

      script.onload = () => {
        this.googleScriptLoaded = true;
        console.log('✅ Google script carregado com sucesso');
        resolve();
      };

      script.onerror = (error) => {
        console.error('❌ Erro ao carregar Google script:', error);
        resolve();
      };

      document.head.appendChild(script);
    });
  }

  initGoogleAuth() {
    const google = (window as any).google;

    if (!google || !google.accounts) {
      console.error('Google accounts não disponível');
      return;
    }

    try {
      google.accounts.id.initialize({
        client_id:
          '896759291407-b4lj38il3b7lilp4vkme6852frae2ov8.apps.googleusercontent.com',
        callback: (response: any) => {
          this.ngZone.run(() => {
            this.handleGoogleLogin(response);
          });
        },
        auto_select: false,
        cancel_on_tap_outside: false,
        use_fedcm_for_prompt: false,
      });

      const buttonElement = document.getElementById('google-button');
      if (buttonElement) {
        google.accounts.id.renderButton(buttonElement, {
          theme: 'outline',
          size: 'large',
          type: 'standard',
          width: '100%',
          logo_alignment: 'left',
        });
        console.log('✅ Botão Google renderizado com sucesso');
      } else {
        console.error('❌ Elemento google-button não encontrado');
      }
    } catch (error) {
      console.error('❌ Erro ao inicializar Google Sign-In:', error);
    }
  }

  handleGoogleLogin(response: any) {
    console.log('🔵 Google callback iniciado');

    if (response?.credential) {
      this.isGoogleLoading = true;
      this.cdr.detectChanges();

      console.log('🔵 Enviando credencial para o backend...');

      this.authService.loginWithGoogle(response.credential).subscribe({
        next: (res) => {
          console.log('🔵 Resposta do backend recebida');
          this.isGoogleLoading = false;
          this.cdr.detectChanges();

          if (res) {
            console.log('✅ Login com Google bem-sucedido');
            this.toastService.success('Login com Google feito com sucesso');

            setTimeout(() => {
              this.cartService.promptAndSyncOnLogin();
              this.navigateAfterLogin();
            }, 500);
          } else {
            this.toastService.error('Falha no login com Google');
          }
        },
        error: (err) => {
          console.error('❌ Erro no login com Google:', err);
          this.isGoogleLoading = false;
          this.cdr.detectChanges();
          this.toastService.error('Falha no login com Google');
        },
      });
    } else {
      this.toastService.error('Credenciais do Google não encontradas.');
    }
  }

  submit() {
    if (this.loginForm.invalid) {
      this.toastService.error(
        'Por favor, preencha todos os campos corretamente'
      );
      return;
    }

    this.isLoading = true;
    const { email, password } = this.loginForm.value;

    this.authService.login(email, password).subscribe({
      next: (res) => {
        this.isLoading = false;

        if (res) {
          this.toastService.success('Login feito com sucesso');

          setTimeout(() => {
            this.cartService.promptAndSyncOnLogin();
            this.navigateAfterLogin();
          }, 500);
        } else {
          this.toastService.error('Credenciais inválidas');
        }
      },
      error: (err) => {
        this.isLoading = false;
        console.error('Erro:', err);

        if (err.status === 401) {
          this.toastService.error('Email ou senha incorretos');
        } else if (err.status === 0) {
          this.toastService.error('Erro de conexão. Verifique sua internet');
        } else {
          this.toastService.error('Erro ao fazer login. Tente novamente');
        }
      },
    });
  }

  // 🔁 Novo método unificado para decidir onde redirecionar após login
  navigateAfterLogin(): void {
    if (this.returnUrl && this.returnUrl !== '/') {
      this.authService.clearReturnUrl(); // limpa o valor persistido
      this.router.navigateByUrl(this.returnUrl);
    } else {
      this.navigateToDashboard();
    }
  }

  navigateToDashboard() {
    const userType = this.authService.getUserType();

    if (userType === 'ADMIN') {
      this.router.navigate(['/admin']);
    } else if (userType === 'USER') {
      this.router.navigate(['']);
    } else {
      this.router.navigate(['/']);
    }
  }

  navigate() {
    this.router.navigate(['']);
  }

  get isAnyLoading(): boolean {
    return this.isLoading || this.isGoogleLoading;
  }
}
