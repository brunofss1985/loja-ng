import { Component, OnInit, AfterViewInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
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
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, AfterViewInit {
  loginForm: FormGroup = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)])
  });

  errorMessage: string = '';

  constructor(
    private router: Router,
    private toastService: ToastrService,
    private authService: AuthService,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    window.handleGoogleLogin = this.handleGoogleLogin.bind(this);
  }

  ngAfterViewInit(): void {
    this.loadGoogleScript().then(() => {
      this.initGoogleAuth();
    });
  }

  /**
   * Carrega o script do Google de forma assíncrona.
   * @returns Promise que resolve quando o script é carregado.
   */
  loadGoogleScript(): Promise<void> {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.onload = () => resolve();
      document.head.appendChild(script);
    });
  }

  initGoogleAuth() {
    const google = (window as any).google;
    if (google) {
      google.accounts.id.initialize({
        client_id: '896759291407-b4lj38il3b7lilp4vkme6852frae2ov8.apps.googleusercontent.com',
        callback: window.handleGoogleLogin,
        cancel_on_tap_outside: false
      });
      google.accounts.id.renderButton(
        document.getElementById('google-button'),
        { theme: 'outline', size: 'large' }
      );
    }
  }

  // Restante do código do componente...
  handleGoogleLogin(response: any) {
    if (response?.credential) {
      this.authService.loginWithGoogle(response.credential).subscribe({
        next: (res) => {
          if (res) {
            this.toastService.success("Login com Google feito com sucesso");
            this.cartService.promptAndSyncOnLogin();
            this.navigateToDashboard();
          } else {
            this.toastService.error("Falha no login com Google");
          }
        },
        error: (err) => {
          console.error('Erro no login com Google:', err);
          this.toastService.error("Falha no login com Google");
        }
      });
    } else {
      this.toastService.error("Credenciais do Google não encontradas.");
    }
  }

  submit() {
    const { email, password } = this.loginForm.value;
    
    this.authService.login(email, password).subscribe({
      next: (res) => {
        if (res) {
          this.toastService.success("Login feito com sucesso");
          this.cartService.promptAndSyncOnLogin();
          this.navigateToDashboard();
        } else {
          this.toastService.error("Credenciais inválidas");
        }
      },
      error: (err) => {
        console.error('Erro:', err);
        this.toastService.error("Erro ao fazer login");
      }
    });
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
    this.router.navigate([""]);
  }
}