import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule, MatButtonModule, MatIconModule, MatMenuModule],
  template: `
    <nav class="sticky top-0 z-50 w-full backdrop-blur-md bg-surface/80 border-b border-white/10 transition-all duration-300">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16 items-center">
          
          <div class="flex-shrink-0 flex items-center cursor-pointer" routerLink="/events">
            <span class="text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent tracking-tighter">
              SPORTCOACH
            </span>
          </div>

          <div class="hidden md:flex items-center space-x-8">
            <a routerLink="/events" class="text-text-primary hover:text-primary transition-colors font-medium">Eventi</a>
            @if (authService.currentUser()) {
              <a routerLink="/profile" class="text-text-primary hover:text-primary transition-colors font-medium">Profilo</a>
              
              <button mat-button [matMenuTriggerFor]="userMenu" class="!rounded-full !py-1 !px-2 flex items-center hover:bg-white/5 transition-colors">
                <div class="w-8 h-8 rounded-full bg-gradient-to-tr from-primary to-accent flex items-center justify-center text-sm font-bold text-white shadow-lg overflow-hidden">
                  @if (authService.currentUser()?.avatar) {
                    <img [src]="authService.currentUser()?.avatar" alt="Avatar" class="w-full h-full object-cover">
                  } @else {
                    {{ authService.currentUser()?.name?.charAt(0) | uppercase }}
                  }
                </div>
                <mat-icon class="ml-1 text-text-secondary scale-75">expand_more</mat-icon>
              </button>
              
              <mat-menu #userMenu="matMenu" class="!bg-surface-elevated !border !border-white/10 !rounded-xl !mt-2">
                <button mat-menu-item routerLink="/profile" class="!text-text-primary hover:!text-primary">
                  <mat-icon class="text-text-secondary">person</mat-icon>
                  <span>Il mio profilo</span>
                </button>
                <button mat-menu-item routerLink="/profile/history" class="!text-text-primary hover:!text-primary">
                  <mat-icon class="text-text-secondary">history</mat-icon>
                  <span>Storico Eventi</span>
                </button>
                <div class="h-px bg-white/10 my-1"></div>
                <button mat-menu-item (click)="logout()" class="!text-accent hover:!text-accent">
                  <mat-icon class="text-accent">logout</mat-icon>
                  <span>Esci</span>
                </button>
              </mat-menu>
            } @else {
              <button mat-flat-button color="primary" routerLink="/auth/login" class="!rounded-full !px-6 !font-bold bg-primary hover:bg-primary-dark text-background shadow-[0_0_15px_rgba(0,212,255,0.4)] transition-all inline-flex items-center justify-center">
                Accedi
              </button>
            }
          </div>

          <div class="md:hidden flex items-center">
             <button mat-icon-button (click)="mobileMenuOpen = !mobileMenuOpen" class="text-text-primary">
               <mat-icon>{{ mobileMenuOpen ? 'close' : 'menu' }}</mat-icon>
             </button>
          </div>

        </div>
      </div>

      <!-- Mobile menu -->
      @if (mobileMenuOpen) {
        <div class="md:hidden absolute top-16 left-0 w-full bg-surface-elevated border-b border-white/10 shadow-2xl animate-fade-in">
          <div class="px-4 pt-2 pb-6 space-y-2">
            <a routerLink="/events" (click)="mobileMenuOpen = false" class="block px-3 py-3 rounded-lg text-base font-medium text-text-primary hover:bg-white/5">Eventi</a>
            @if (authService.currentUser()) {
              <a routerLink="/profile" (click)="mobileMenuOpen = false" class="block px-3 py-3 rounded-lg text-base font-medium text-text-primary hover:bg-white/5">Profilo</a>
              <a routerLink="/profile/history" (click)="mobileMenuOpen = false" class="block px-3 py-3 rounded-lg text-base font-medium text-text-primary hover:bg-white/5">Storico Eventi</a>
              <div class="h-px bg-white/10 my-2"></div>
              <button (click)="logout(); mobileMenuOpen = false" class="w-full text-left px-3 py-3 rounded-lg text-base font-medium text-accent hover:bg-white/5">Esci</button>
            } @else {
              <a routerLink="/auth/login" (click)="mobileMenuOpen = false" class="block px-3 py-3 rounded-lg text-base font-medium text-primary hover:bg-white/5">Accedi</a>
            }
          </div>
        </div>
      }
    </nav>
  `
})
export class NavbarComponent {
  authService = inject(AuthService);
  mobileMenuOpen = false;

  logout() {
    this.authService.logout();
  }
}
