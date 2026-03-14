import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatSliderModule } from '@angular/material/slider';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { EventFilters } from '../../../core/models/event.model';

@Component({
  selector: 'app-event-filters',
  standalone: true,
  imports: [
    CommonModule, FormsModule, MatSelectModule, MatSliderModule, MatButtonToggleModule,
    MatFormFieldModule, MatInputModule, MatDatepickerModule, MatSlideToggleModule,
    MatButtonModule, MatIconModule
  ],
  template: `
    <div class="h-full flex flex-col">
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-2xl font-bold text-white">Filtra Eventi</h2>
        <button mat-icon-button (click)="close.emit()" class="text-text-secondary hover:text-white">
          <mat-icon>close</mat-icon>
        </button>
      </div>

      <div class="flex-1 overflow-y-auto space-y-6 pb-20 pr-2">
        
        <!-- Sport -->
        <div>
          <label class="block text-sm text-text-secondary mb-2">Sport</label>
          <mat-form-field appearance="outline" class="w-full !text-white">
            <mat-select [(ngModel)]="filters.sport">
              <mat-option [value]="undefined">Tutti gli sport</mat-option>
              @for (s of sports; track s) {
                <mat-option [value]="s">{{ s }}</mat-option>
              }
            </mat-select>
          </mat-form-field>
        </div>

        <!-- Prezzo -->
        <div>
          <div class="flex justify-between text-sm mb-2">
            <label class="text-text-secondary">Range di prezzo</label>
            <span class="text-accent font-bold">€{{ filters.minCost || 0 }} - €{{ filters.maxCost || 1000 }}</span>
          </div>
          <mat-slider min="0" max="1000" step="10" class="w-full">
            <input matSliderStartThumb [(ngModel)]="filters.minCost">
            <input matSliderEndThumb [(ngModel)]="filters.maxCost">
          </mat-slider>
        </div>

        <!-- Esperienza -->
        <div>
          <label class="block text-sm text-text-secondary mb-2">Livello Esperienza</label>
          <mat-button-toggle-group [(ngModel)]="filters.experience" class="w-full flex mx-0 bg-surface border-white/10 rounded-xl overflow-hidden">
            <mat-button-toggle value="Principiante" class="flex-1 !bg-transparent text-white/70">Principiante</mat-button-toggle>
            <mat-button-toggle value="Intermedio" class="flex-1 !bg-transparent text-white/70">Intermedio</mat-button-toggle>
            <mat-button-toggle value="Avanzato" class="flex-1 !bg-transparent text-white/70">Avanzato</mat-button-toggle>
          </mat-button-toggle-group>
        </div>

        <!-- Durata -->
        <div>
          <label class="block text-sm text-text-secondary mb-2">Durata</label>
          <mat-form-field appearance="outline" class="w-full">
            <mat-select [(ngModel)]="filters.duration">
              <mat-option [value]="undefined">Qualsiasi</mat-option>
              <mat-option [value]="60">1 ora</mat-option>
              <mat-option [value]="90">1.5 ore</mat-option>
              <mat-option [value]="120">2 ore</mat-option>
              <mat-option [value]="180">3 ore</mat-option>
            </mat-select>
          </mat-form-field>
        </div>

        <!-- VIP -->
        <div class="flex items-center justify-between bg-surface p-4 rounded-xl border border-white/10">
          <div>
            <div class="font-bold text-white flex items-center">
              Eventi VIP <mat-icon class="scale-[0.6] text-vip-gold ml-1">star</mat-icon>
            </div>
            <div class="text-xs text-text-secondary">Solo coach certificati VIP</div>
          </div>
          <mat-slide-toggle [(ngModel)]="filters.hasVip" color="accent"></mat-slide-toggle>
        </div>

      </div>

      <!-- Action Buttons -->
      <div class="mt-auto pt-4 flex gap-4 bg-background z-10 sticky bottom-0 border-t border-white/10">
        <button mat-button class="flex-1 border border-white/10 text-white" (click)="reset()">
          Azzera
        </button>
        <button mat-flat-button color="accent" class="flex-1 !bg-accent text-white" (click)="apply()">
          Applica Filtri
        </button>
      </div>
    </div>
  `
})
export class EventFiltersComponent {
  @Input() set currentFilters(val: EventFilters) {
    this.filters = { ...val };
  }
  @Output() filtersChanged = new EventEmitter<EventFilters>();
  @Output() close = new EventEmitter<void>();

  filters: EventFilters = {};
  sports = ['Calcio', 'Tennis', 'Nuoto', 'Ciclismo', 'Pallacanestro', 'Padel', 'Running', 'Yoga', 'CrossFit'];

  apply() {
    this.filtersChanged.emit(this.filters);
  }

  reset() {
    this.filters = {};
    this.filtersChanged.emit(this.filters);
  }
}
