import { Component, inject, OnInit, signal, computed } from '@angular/core';

import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatBadgeModule } from '@angular/material/badge';
import { EventCardComponent } from '../event-card/event-card.component';
import { EventFiltersComponent } from '../event-filters/event-filters.component';
import { EventsService } from '../../../core/services/events.service';
import { STORAGE_KEYS, StorageService } from '../../../core/services/storage.service';
import { EventFilters, SportEvent } from '../../../core/models/event.model';

@Component({
  selector: 'app-event-list',

  imports: [
    MatIconModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatBadgeModule,
    EventCardComponent,
    EventFiltersComponent,
  ],
  template: `
    <div class="flex flex-col max-w-lg mx-auto h-[calc(100vh-4rem)]">

      <!-- Cards area -->
      <div class="relative flex-1 overflow-hidden">

        <!-- Filters Panel -->
        @if (showFilters()) {
          <div
            class="absolute inset-x-0 bottom-0 top-0 z-50 bg-background/95 backdrop-blur-3xl p-6 rounded-t-3xl border-t border-white/10 shadow-2xl"
          >
            <app-event-filters
              [currentFilters]="filters()"
              (filtersChanged)="applyFilters($event)"
              (close)="toggleFilters()"
            />
          </div>
        }

        <!-- Event Swiper -->
        @if (isLoading()) {
          <div class="h-full flex items-center justify-center">
            <mat-spinner diameter="48" class="!stroke-accent" />
          </div>
        } @else if (events().length === 0) {
          <div
            class="h-full flex flex-col items-center justify-center text-center p-6 bg-surface/30 rounded-3xl border border-white/5 mx-2"
          >
            <div class="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-4">
              <mat-icon class="scale-[2] text-text-secondary">search_off</mat-icon>
            </div>
            <h3 class="text-xl font-bold text-white mb-2">Nessun evento trovato</h3>
            <p class="text-text-secondary text-sm mb-6 max-w-[250px]">
              Prova a modificare i filtri o la tua ricerca per vedere più risultati.
            </p>
            <button
              mat-flat-button
              color="accent"
              class="!bg-accent text-white !rounded-full px-6 py-2"
              (click)="resetFilters()"
            >
              Reimposta filtri
            </button>
          </div>
        } @else {
          <div
            class="h-full overflow-y-auto snap-y snap-mandatory scroll-smooth hide-scrollbar px-2"
            (scroll)="onScroll($event)"
            (touchstart)="onTouchStart($event)"
            (touchend)="onTouchEnd($event)"
          >
            @for (event of events(); track event.id; let i = $index) {
              <div class="snap-start snap-always h-full pb-3 flex items-center">
                <app-event-card [event]="event" (cardClick)="viewDetail($event)" />
              </div>
            }
          </div>

          <!-- Pagination Dots -->
          <div
            class="absolute right-4 top-1/2 -translate-y-1/2 flex flex-col gap-2 z-10 pointer-events-none drop-shadow-lg"
          >
            @for (event of events(); track event.id; let i = $index) {
              <div
                class="w-1.5 rounded-full transition-all duration-300"
                [class]="
                  i === currentIndex()
                    ? 'h-8 bg-accent shadow-[0_0_10px_rgba(255,107,53,0.8)]'
                    : 'h-2 bg-white/30'
                "
              ></div>
            }
          </div>
        }
      </div>

      <!-- Bottom Action Bar -->
      <div
        class="flex items-center justify-between px-5 py-3 bg-surface/80 backdrop-blur-md border-t border-white/10 shrink-0"
      >
        <!-- Left: filter button -->
        <button
          mat-icon-button
          (click)="toggleFilters()"
          class="!text-text-primary !bg-white/5 !border !border-white/10 !rounded-xl !w-12 !h-12"
          [matBadge]="activeFiltersCount()"
          matBadgePosition="above after"
          matBadgeColor="warn"
          [matBadgeHidden]="activeFiltersCount() === 0"
          aria-label="Apri filtri"
        >
          <mat-icon>tune</mat-icon>
        </button>

        <!-- Center: active filters label -->
        @if (activeFiltersCount() > 0) {
          <span class="text-xs text-text-secondary">
            {{ activeFiltersCount() }} filtri attivi
          </span>
          <button
            mat-button
            (click)="resetFilters()"
            class="!text-accent !text-xs"
          >
            Reimposta
          </button>
        } @else {
          <span class="text-xs text-text-secondary">Scorri per esplorare</span>
          <div class="w-10"></div>
        }
      </div>
    </div>
  `,
  styles: [
    `
      .hide-scrollbar::-webkit-scrollbar {
        display: none;
      }
      .hide-scrollbar {
        -ms-overflow-style: none;
        scrollbar-width: none;
      }
    `,
  ],
})
export class EventListComponent implements OnInit {
  private eventsService = inject(EventsService);
  private storage = inject(StorageService);
  private router = inject(Router);

  events = signal<SportEvent[]>([]);
  isLoading = signal(true);
  showFilters = signal(false);
  filters = signal<EventFilters>({});

  currentIndex = signal(0);
  private startY = 0;

  activeFiltersCount = computed(() => {
    const f = this.filters() as any;
    return Object.keys(f).filter((k) => f[k] !== undefined && f[k] !== null && f[k] !== '').length;
  });

  ngOnInit() {
    const saved = this.storage.getSessionItem<EventFilters>(STORAGE_KEYS.EVENT_FILTERS);
    if (saved) {
      this.filters.set(saved);
    }
    this.loadEvents();
  }

  loadEvents() {
    this.isLoading.set(true);
    this.eventsService.getEvents(this.filters()).subscribe({
      next: (res) => {
        this.events.set(res.events);
        this.isLoading.set(false);
        this.currentIndex.set(0);
      },
      error: () => this.isLoading.set(false),
    });
  }

  toggleFilters() {
    this.showFilters.update((v) => !v);
  }

  applyFilters(newFilters: EventFilters) {
    this.filters.set(newFilters);
    this.storage.setSessionItem(STORAGE_KEYS.EVENT_FILTERS, newFilters);
    this.showFilters.set(false);
    this.loadEvents();
  }

  resetFilters() {
    this.filters.set({});
    this.storage.removeSessionItem(STORAGE_KEYS.EVENT_FILTERS);
    this.loadEvents();
    this.showFilters.set(false);
  }

  viewDetail(eventId: string) {
    this.router.navigate(['/events', eventId]);
  }

  onScroll(event: Event) {
    const target = event.target as HTMLElement;
    const itemHeight = target.clientHeight;
    // Calculate the index based on the amount scrolled
    const index = Math.round(target.scrollTop / itemHeight);

    // Ensure we only update if the index actually changes
    if (index !== this.currentIndex() && index >= 0 && index < this.events().length) {
      this.currentIndex.set(index);
    }
  }

  onTouchStart(e: TouchEvent) {
    this.startY = e.touches[0].clientY;
  }

  onTouchEnd(e: TouchEvent) {
    const delta = this.startY - e.changedTouches[0].clientY;
    if (Math.abs(delta) > 50) {
      if (delta > 0 && this.currentIndex() < this.events().length - 1) {
        this.currentIndex.update((v) => v + 1);
      } else if (delta < 0 && this.currentIndex() > 0) {
        this.currentIndex.update((v) => v - 1);
      }
    }
  }
}
