import { Component, inject, OnInit, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { forkJoin, map, switchMap, of, catchError } from 'rxjs';
import { AuthService } from '../../../core/services/auth.service';
import { PerformanceService } from '../../../core/services/performance.service';
import { EventsService } from '../../../core/services/events.service';

@Component({
  selector: 'app-event-history',

  imports: [RouterModule, MatButtonModule, MatIconModule, MatProgressSpinnerModule, DatePipe],
  template: `
    <div
      class="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8 animate-fade-in relative min-h-[calc(100vh-4rem)]"
    >
      <div
        class="absolute top-[-20%] left-[-20%] w-[500px] h-[500px] bg-accent/10 rounded-full blur-[120px] pointer-events-none"
      ></div>

      <div class="flex items-center mb-8 relative z-10">
        <button
          mat-icon-button
          routerLink="/profile"
          class="text-white hover:bg-white/5 mr-2 -ml-2"
        >
          <mat-icon>arrow_back</mat-icon>
        </button>
        <h1 class="text-3xl font-black text-white tracking-tight">Storico Eventi</h1>
      </div>

      @if (isLoading()) {
        <div class="flex items-center justify-center p-12">
          <mat-spinner diameter="48" class="!stroke-accent" />
        </div>
      } @else if (historyItems().length === 0) {
        <div
          class="bg-surface-elevated border border-white/5 rounded-3xl p-12 text-center shadow-2xl"
        >
          <div
            class="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4"
          >
            <mat-icon class="scale-[2] text-text-secondary">history_toggle_off</mat-icon>
          </div>
          <h3 class="text-2xl font-bold text-white mb-2">Nessun evento passato</h3>
          <p class="text-text-secondary mb-8 max-w-sm mx-auto">
            Non hai ancora partecipato a nessun evento. Cerca nuovi eventi e inizia ad allenarti!
          </p>
          <button
            mat-flat-button
            color="accent"
            routerLink="/events"
            class="!rounded-xl px-8 py-6 text-lg font-bold !bg-accent text-white shadow-[0_0_20px_rgba(255,107,53,0.3)]"
          >
            Esplora Eventi
          </button>
        </div>
      } @else {
        <div class="space-y-6 relative z-10">
          @for (item of historyItems(); track item.performance.id) {
            <div
              class="bg-surface border border-white/5 rounded-3xl p-5 shadow-xl hover:border-white/20 transition-all group flex flex-col md:flex-row gap-6"
            >
              <div class="w-full md:w-48 h-32 rounded-2xl overflow-hidden relative shrink-0">
                @if (item.event) {
                  <img
                    [src]="item.event.coverImage"
                    class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div
                    class="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent"
                  ></div>
                  <div class="absolute bottom-2 left-2 right-2 flex justify-between">
                    <span class="text-xs font-bold text-primary uppercase tracking-wider">{{
                      item.event.sport
                    }}</span>
                  </div>
                } @else {
                  <div class="w-full h-full bg-white/5 flex items-center justify-center">
                    <mat-icon class="text-white/20 scale-150">image</mat-icon>
                  </div>
                }
              </div>

              <div class="flex-1 flex flex-col justify-center">
                <div class="flex justify-between items-start mb-2 gap-3">
                  <h3 class="text-xl font-bold text-white">
                    {{ item.event?.title || 'Evento non disponibile' }}
                  </h3>
                  <div
                    class="bg-primary/20 text-primary border border-primary/30 px-3 py-1 rounded-lg font-bold text-sm"
                  >
                    Score: {{ item.performance.performanceScore }}/100
                  </div>
                </div>

                <div class="text-text-secondary text-sm mb-4">
                  <span class="mr-3 flex-inline items-center"
                    ><mat-icon class="scale-[0.6] align-middle -mt-1 -mr-1"
                      >calendar_today</mat-icon
                    >
                    {{ item.performance.date | date: 'longDate' }}</span
                  >
                </div>

                <div class="mt-auto">
                  <a
                    mat-stroked-button
                    color="accent"
                    [routerLink]="['/profile/history', item.performance.id, 'performance']"
                    class="!border-white/20 text-white hover:!bg-accent hover:!border-accent transition-colors !rounded-xl"
                  >
                    <mat-icon class="mr-2">insights</mat-icon> Analisi Performance
                  </a>
                </div>
              </div>
            </div>
          }
        </div>
      }
    </div>
  `,
})
export class EventHistoryComponent implements OnInit {
  authService = inject(AuthService);
  perfService = inject(PerformanceService);
  eventsService = inject(EventsService);

  historyItems = signal<any[]>([]);
  isLoading = signal(true);

  ngOnInit() {
    const user = this.authService.currentUser();
    if (user) {
      this.perfService
        .getUserPerformances(user.id)
        .pipe(
          switchMap((performances) => {
            if (!performances || performances.length === 0) {
              return of([]);
            }
            const requests = performances.map((p) =>
              this.eventsService.getEventById(p.eventId).pipe(
                map((event) => ({ performance: p, event })),
                catchError(() => of({ performance: p, event: null })),
              ),
            );
            return forkJoin(requests);
          }),
        )
        .subscribe({
          next: (items) => {
            this.historyItems.set(items);
            this.isLoading.set(false);
          },
          error: () => this.isLoading.set(false),
        });
    } else {
      this.isLoading.set(false);
    }
  }
}
