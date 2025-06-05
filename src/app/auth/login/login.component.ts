import { Component, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule
  ],
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnDestroy {
  private loginSub?: Subscription;
  isLoading = false;
  errorMessage = '';

  loginForm = new FormGroup({
    username: new FormControl('', [Validators.required, Validators.minLength(3)]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)])
  });

  constructor(private http: HttpClient, private router: Router) {}

  get username() { return this.loginForm.get('username'); }
  get password() { return this.loginForm.get('password'); }

  login() {
    if (this.loginForm.invalid) return;

    this.isLoading = true;
    this.errorMessage = '';

    this.loginSub = this.http.post<{ token: string }>(
      'http://localhost:8080/auth/login',
      this.loginForm.value
    ).subscribe({
      next: (res) => {
        localStorage.setItem('token', res.token);
        this.router.navigate(['/chat']);
      },
      error: (err: HttpErrorResponse) => {
        this.isLoading = false;
        this.errorMessage = err.error?.message || 'Erro desconhecido no login';

        if (err.status === 401) {
          this.errorMessage = 'Credenciais inválidas';
        }
      },
      complete: () => this.isLoading = false
    });
  }

  goToRegister(): void {
    this.router.navigate(['/auth/register']);
  }

  ngOnDestroy() {
    this.loginSub?.unsubscribe();
  }
}
