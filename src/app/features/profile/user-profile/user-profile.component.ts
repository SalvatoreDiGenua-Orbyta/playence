import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { AuthService } from '../../../core/services/auth.service';
import { User } from '../../../core/models/user.model';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [CommonModule, RouterModule, MatButtonModule, MatIconModule, MatChipsModule],
  template: `
    <div class="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8 animate-fade-in relative">
      <div class="absolute top-[-10%] right-[-10%] w-[400px] h-[400px] bg-primary/20 rounded-full blur-[120px] pointer-events-none"></div>

      <div class="flex items-center justify-between mb-8 relative z-10">
        <h1 class="text-3xl font-black text-white tracking-tight">Il Mio Profilo</h1>
        <button mat-stroked-button color="accent" (click)="logout()" class="!border-white/20 !text-white hover:!bg-white/5">
          <mat-icon class="mr-2">logout</mat-icon> Esci
        </button>
      </div>

      @if (user()) {
        <div class="bg-surface-elevated border border-white/5 rounded-3xl p-8 mb-8 shadow-2xl relative z-10 flex flex-col md:flex-row items-center gap-8">
          <div class="w-32 h-32 rounded-full border-4 border-primary/50 overflow-hidden shrink-0 flex items-center justify-center bg-gradient-to-tr from-primary to-accent relative shadow-[0_0_30px_rgba(0,212,255,0.3)]">
            @if (user()?.avatar) {
              <img [src]="user()?.avatar" class="w-full h-full object-cover">
            } @else {
              <span class="text-5xl font-black text-white">{{ user()?.name?.charAt(0) | uppercase }}</span>
            }
          </div>
          
          <div class="flex-1 text-center md:text-left">
            <h2 class="text-3xl font-bold text-white mb-2">{{ user()?.name }}</h2>
            <div class="flex flex-col md:flex-row gap-4 md:gap-8 text-text-secondary mt-4">
              <div class="flex items-center justify-center md:justify-start">
                <mat-icon class="scale-90 mr-2 text-primary">email</mat-icon> {{ user()?.email }}
              </div>
              <div class="flex items-center justify-center md:justify-start">
                <mat-icon class="scale-90 mr-2 text-accent">phone</mat-icon> {{ user()?.phone }}
              </div>
            </div>
            
            <div class="mt-6">
              <div class="text-sm font-bold text-white mb-2 uppercase tracking-widest text-left">Sport Preferiti</div>
              <div class="flex flex-wrap gap-2 justify-center md:justify-start">
                @for (sport of user()?.preferredSports; track sport) {
                  <span class="px-3 py-1 bg-white/5 border border-white/10 rounded-lg text-sm text-text-primary">{{ sport }}</span>
                }
              </div>
            </div>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
          <a routerLink="/profile/history" class="bg-gradient-to-br from-surface to-surface-elevated border border-white/10 rounded-3xl p-6 hover:border-primary/50 transition-all hover:shadow-[0_0_30px_rgba(0,212,255,0.15)] group relative overflow-hidden">
            <div class="absolute -right-4 -top-4 text-white/5 scale-[4] group-hover:text-primary/10 transition-colors">
              <mat-icon>history</mat-icon>
            </div>
            <div class="w-12 h-12 bg-primary/20 rounded-2xl flex items-center justify-center mb-4 border border-primary/30">
              <mat-icon class="text-primary">history</mat-icon>
            </div>
            <h3 class="text-xl font-bold text-white mb-2 group-hover:text-primary transition-colors">Storico Eventi</h3>
            <p class="text-text-secondary text-sm">Visualizza tutti gli eventi passati, le tue recensioni e sblocca l'analisi AI delle tue performance sportive.</p>
            <div class="mt-4 flex items-center text-primary text-sm font-bold uppercase tracking-widest">
              Esplora <mat-icon class="scale-75 ml-1 group-hover:translate-x-1 transition-transform">arrow_forward</mat-icon>
            </div>
          </a>

          <a routerLink="/events" class="bg-gradient-to-br from-surface to-surface-elevated border border-white/10 rounded-3xl p-6 hover:border-accent/50 transition-all hover:shadow-[0_0_30px_rgba(255,107,53,0.15)] group relative overflow-hidden">
             <div class="absolute -right-4 -top-4 text-white/5 scale-[4] group-hover:text-accent/10 transition-colors">
              <mat-icon>event_available</mat-icon>
            </div>
            <div class="w-12 h-12 bg-accent/20 rounded-2xl flex items-center justify-center mb-4 border border-accent/30">
              <mat-icon class="text-accent">event_available</mat-icon>
            </div>
            <h3 class="text-xl font-bold text-white mb-2 group-hover:text-accent transition-colors">Trova Eventi</h3>
            <p class="text-text-secondary text-sm">Scopri nuovi eventi, allenati con coach VIP e migliora le tue performance con i nostri programmi.</p>
            <div class="mt-4 flex items-center text-accent text-sm font-bold uppercase tracking-widest">
              Scopri <mat-icon class="scale-75 ml-1 group-hover:translate-x-1 transition-transform">arrow_forward</mat-icon>
            </div>
          </a>
        </div>
      }
    </div>
  `
})
export class UserProfileComponent implements OnInit {
  authService = inject(AuthService);
  user = signal<User | null>(null);

  ngOnInit() {
    this.user.set(this.authService.currentUser());
  }

  logout() {
    this.authService.logout();
  }
}
