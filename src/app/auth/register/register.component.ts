import { Component, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { confirmPasswordValidator } from '../../validators/password.validator';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule
  ],
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnDestroy {
  private registerSub?: Subscription;
  isLoading = false;
  errorMessage = '';
  successMessage = '';

  registerForm = new FormGroup({
    username: new FormControl('', [
      Validators.required,
      Validators.minLength(3),
      Validators.pattern(/^[a-zA-Z0-9_]+$/)
    ]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(6),
      Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).*$/)
    ]),
    confirmPassword: new FormControl('', [Validators.required])
  }, { validators: confirmPasswordValidator });

  constructor(private http: HttpClient, private router: Router) {}

  get username() { return this.registerForm.get('username'); }
  get password() { return this.registerForm.get('password'); }
  get confirmPassword() { return this.registerForm.get('confirmPassword'); }

  register() {
    if (this.registerForm.invalid) return;

    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    const payload = {
      username: this.username?.value,
      password: this.password?.value
    };

    this.registerSub = this.http.post<any>(
      'http://localhost:8080/auth/register',
      payload
    ).subscribe({
      next: (response) => {
        this.successMessage = 'Cadastro realizado com sucesso!';
        if (response.token) {
          localStorage.setItem('token', response.token);
          setTimeout(() => this.router.navigate(['/']), 1500);
        }
      },
      error: (err: HttpErrorResponse) => {
        this.isLoading = false;
        this.handleRegistrationError(err);
      },
      complete: () => this.isLoading = false
    });
  }

  goToLogin(): void {
    this.router.navigate(['/auth/login']).then(r =>
    console.log("Voltou para login"));
  }

  private handleRegistrationError(err: HttpErrorResponse): void {
    switch (err.status) {
      case 409:
        this.errorMessage = 'Usuário já existe';
        break;
      case 400:
        this.errorMessage = 'Dados inválidos';
        break;
      default:
        this.errorMessage = err.error?.message || 'Erro desconhecido no cadastro';
    }
  }

  ngOnDestroy() {
    this.registerSub?.unsubscribe();
  }
}
