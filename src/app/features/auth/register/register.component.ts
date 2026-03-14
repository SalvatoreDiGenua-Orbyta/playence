import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatChipsModule
  ],
  template: `
    <div class="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 relative overflow-hidden py-12">
      <div class="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-accent/20 rounded-full blur-[120px] pointer-events-none"></div>

      <div class="w-full max-w-xl bg-surface-elevated/80 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl p-8 relative z-10">
        <div class="text-center mb-8">
          <h1 class="text-4xl font-black mb-2 text-transparent bg-clip-text bg-gradient-to-r from-accent to-white tracking-tight">Crea Account</h1>
          <p class="text-text-secondary">Unisciti alla community di SportCoach</p>
        </div>

        @if (errorMsg()) {
          <div class="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-xl flex items-center text-red-400 text-sm">
            <mat-icon class="mr-2">error_outline</mat-icon>
            {{ errorMsg() }}
          </div>
        }

        <form [formGroup]="registerForm" (ngSubmit)="onSubmit()" class="space-y-5">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
            <!-- Nome -->
            <div class="relative">
              <label class="block text-sm font-medium text-text-secondary mb-1 ml-1">Nome Completo</label>
              <input formControlName="name" type="text" placeholder="Mario Rossi" class="w-full bg-surface border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all">
            </div>

            <!-- Email -->
            <div class="relative">
              <label class="block text-sm font-medium text-text-secondary mb-1 ml-1">Email</label>
              <input formControlName="email" type="email" placeholder="nome@email.com" class="w-full bg-surface border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all">
            </div>

            <!-- Cellulare -->
            <div class="relative md:col-span-2">
              <label class="block text-sm font-medium text-text-secondary mb-1 ml-1">Cellulare</label>
              <div class="flex">
                <span class="inline-flex items-center px-4 rounded-l-xl border border-r-0 border-white/10 bg-surface/50 text-text-secondary text-sm">
                  +39
                </span>
                <input formControlName="phone" type="tel" placeholder="333 1234567" class="w-full bg-surface border border-white/10 rounded-r-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all">
              </div>
            </div>

            <!-- Password -->
            <div class="relative">
              <label class="block text-sm font-medium text-text-secondary mb-1 ml-1">Password</label>
              <input [type]="hidePwd() ? 'password' : 'text'" formControlName="password" placeholder="••••••••" class="w-full bg-surface border border-white/10 rounded-xl px-4 py-3 pr-12 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all">
              <button type="button" (click)="hidePwd.set(!hidePwd())" class="absolute right-3 top-9 text-text-secondary hover:text-white">
                <mat-icon class="scale-90">{{ hidePwd() ? 'visibility_off' : 'visibility' }}</mat-icon>
              </button>
            </div>

            <!-- Conferma Password -->
            <div class="relative">
              <label class="block text-sm font-medium text-text-secondary mb-1 ml-1">Conferma Password</label>
              <input formControlName="confirmPassword" type="password" placeholder="••••••••" class="w-full bg-surface border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all">
            </div>
          </div>

          <!-- Sport Preferiti -->
          <div class="pt-2">
            <label class="block text-sm font-medium text-text-secondary mb-2 ml-1">Sport Preferiti (Opzionale)</label>
            <mat-chip-listbox multiple>
              @for (sport of availableSports; track sport) {
                <mat-chip-option (selectionChange)="toggleSport(sport, $event.selected)" [color]="'accent'" class="!bg-surface border border-white/10 hover:!bg-white/5 transition-colors text-white">
                  {{ sport }}
                </mat-chip-option>
              }
            </mat-chip-listbox>
            <div class="mt-3 flex">
              <input #customSportInput type="text" placeholder="Aggiungi altro sport..." class="flex-1 bg-surface border border-white/10 rounded-l-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent">
              <button type="button" (click)="addCustomSport(customSportInput)" class="bg-surface border border-white/10 border-l-0 text-accent font-medium px-4 py-2 rounded-r-xl hover:bg-white/5 transition-colors">
                Aggiungi
              </button>
            </div>
          </div>

          <button type="submit" [disabled]="registerForm.invalid || isLoading() || (registerForm.get('password')?.value !== registerForm.get('confirmPassword')?.value)"
                  class="w-full mt-6 py-3.5 rounded-xl font-bold text-white bg-gradient-to-r from-accent/90 to-accent hover:shadow-[0_0_20px_rgba(255,107,53,0.4)] transition-all disabled:opacity-50 flex justify-center items-center">
            @if (isLoading()) {
              <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Registrazione in corso...
            } @else {
              Registrati
            }
          </button>
        </form>

        <div class="mt-8 text-center text-sm text-text-secondary">
          Hai già un account? 
          <a routerLink="/auth/login" class="text-accent hover:text-white font-medium transition-colors">Accedi</a>
        </div>
      </div>
    </div>
  `
})
export class RegisterComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  availableSports = ['Calcio', 'Tennis', 'Nuoto', 'Ciclismo', 'Pallacanestro', 'Padel', 'Running', 'Yoga', 'CrossFit'];
  selectedSports = signal<string[]>([]);

  registerForm = this.fb.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    phone: ['', Validators.required],
    password: ['', [Validators.required, Validators.minLength(6)]],
    confirmPassword: ['', Validators.required]
  });

  hidePwd = signal(true);
  isLoading = signal(false);
  errorMsg = signal<string | null>(null);

  toggleSport(sport: string, selected: boolean) {
    if (selected) {
      this.selectedSports.update(s => [...s, sport]);
    } else {
      this.selectedSports.update(s => s.filter(x => x !== sport));
    }
  }

  addCustomSport(input: HTMLInputElement) {
    const val = input.value.trim();
    if (val && !this.availableSports.includes(val)) {
      this.availableSports.push(val);
      this.selectedSports.update(s => [...s, val]);
    }
    input.value = '';
  }

  onSubmit() {
    if (this.registerForm.valid && this.registerForm.value.password === this.registerForm.value.confirmPassword) {
      this.isLoading.set(true);
      const { name, email, phone, password } = this.registerForm.value;
      const userData = {
        name, email, phone: '+39 ' + phone, password,
        preferredSports: this.selectedSports()
      };

      this.authService.register(userData).subscribe({
        next: () => {
          this.router.navigate(['/events']);
        },
        error: (err) => {
          this.isLoading.set(false);
          this.errorMsg.set('Errore durante la registrazione');
        }
      });
    } else {
      this.registerForm.markAllAsTouched();
    }
  }
}
