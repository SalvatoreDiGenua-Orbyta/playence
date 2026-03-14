import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule
  ],
  template: `
    <div class="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 relative overflow-hidden">
      <!-- Background elements -->
      <div class="absolute top-[-10%] left-[-10%] w-96 h-96 bg-primary/20 rounded-full blur-[100px] pointer-events-none"></div>
      <div class="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-accent/20 rounded-full blur-[100px] pointer-events-none"></div>

      <div class="w-full max-w-md bg-surface-elevated/80 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl p-8 relative z-10">
        <div class="text-center mb-8">
          <h1 class="text-4xl font-black mb-2 text-transparent bg-clip-text bg-gradient-to-r from-primary to-white tracking-tight">Bentornato</h1>
          <p class="text-text-secondary">Accedi per gestire i tuoi eventi sportivi</p>
        </div>

        @if (errorMsg()) {
          <div class="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-xl flex items-center text-red-400 text-sm">
            <mat-icon class="mr-2">error_outline</mat-icon>
            {{ errorMsg() }}
          </div>
        }

        <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="space-y-6">
          <div class="space-y-4">
            <div class="relative">
              <label class="block text-sm font-medium text-text-secondary mb-1 ml-1">Email</label>
              <input formControlName="email" type="email" placeholder="nome@email.com"
                     class="w-full bg-surface border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all">
              @if (loginForm.get('email')?.invalid && loginForm.get('email')?.touched) {
                <span class="text-xs text-red-400 mt-1 ml-1 block">Email non valida</span>
              }
            </div>

            <div class="relative">
              <label class="block text-sm font-medium text-text-secondary mb-1 ml-1">Password</label>
              <div class="relative">
                <input [type]="hidePassword() ? 'password' : 'text'" formControlName="password" placeholder="••••••••"
                       class="w-full bg-surface border border-white/10 rounded-xl pl-4 pr-12 py-3 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all">
                <button type="button" (click)="togglePassword()" class="absolute right-3 top-3 text-text-secondary hover:text-white transition-colors">
                   <mat-icon class="scale-90">{{ hidePassword() ? 'visibility_off' : 'visibility' }}</mat-icon>
                </button>
              </div>
              @if (loginForm.get('password')?.invalid && loginForm.get('password')?.touched) {
                <span class="text-xs text-red-400 mt-1 ml-1 block">Password richiesta</span>
              }
            </div>
          </div>

          <button type="submit" [disabled]="loginForm.invalid || isLoading()"
                  class="w-full py-3.5 rounded-xl font-bold text-background bg-gradient-to-r from-primary to-primary-dark hover:shadow-[0_0_20px_rgba(0,212,255,0.4)] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none flex justify-center items-center">
            @if (isLoading()) {
              <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Accesso in corso...
            } @else {
              Accedi
            }
          </button>
        </form>

        <div class="mt-8 text-center text-sm text-text-secondary">
          Non hai un account? 
          <a routerLink="/auth/register" class="text-primary hover:text-white font-medium transition-colors">Registrati ora</a>
        </div>
      </div>
    </div>
  `
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required]
  });

  hidePassword = signal(true);
  isLoading = signal(false);
  errorMsg = signal<string | null>(null);

  togglePassword() {
    this.hidePassword.update(v => !v);
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.isLoading.set(true);
      this.errorMsg.set(null);
      this.authService.login(this.loginForm.value).subscribe({
        next: () => {
          this.router.navigate(['/events']);
        },
        error: (err) => {
          this.isLoading.set(false);
          this.errorMsg.set(err.error?.error || 'Errore durante il login');
        }
      });
    } else {
      this.loginForm.markAllAsTouched();
    }
  }
}
