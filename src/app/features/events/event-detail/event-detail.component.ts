import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { NgOptimizedImage, NgClass, NgStyle, DatePipe } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { EventsService } from '../../../core/services/events.service';
import { PerformanceService } from '../../../core/services/performance.service';
import { SportEvent } from '../../../core/models/event.model';
import { PerformanceAverage } from '../../../core/models/performance.model';

@Component({
  selector: 'app-event-detail',

  imports: [
    RouterModule,
    MatIconModule,
    MatButtonModule,
    MatChipsModule,
    MatProgressSpinnerModule,
    NgOptimizedImage,
    DatePipe,
    NgClass,
    NgStyle,
  ],
  template: `
    @if (isLoading()) {
      <div class="h-screen flex items-center justify-center bg-background">
        <mat-spinner diameter="48" class="!stroke-accent" />
      </div>
    } @else if (event()) {
      <div
        class="min-h-screen bg-background pb-24 relative animate-fade-in"
        (touchstart)="onTouchStart($event)"
        (touchend)="onTouchEnd($event)"
      >
        <!-- Hero Section -->
        <div class="relative h-[50vh] w-full overflow-hidden">
          <img
            [ngSrc]="event()!.coverImage"
            fill
            priority
            class="object-cover transition-transform duration-[20s] hover:scale-110 origin-center"
            [ngStyle]="{ transform: 'translateY(' + scrollY() * 0.4 + 'px)' }"
            alt="Event Cover"
          />

          <div
            class="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent"
          ></div>

          <!-- Back Button -->
          <button
            mat-icon-button
            (click)="goBack()"
            class="absolute top-4 left-4 z-50 bg-black/30 backdrop-blur-md text-white border border-white/20 z-10"
          >
            <mat-icon>arrow_back</mat-icon>
          </button>

          <!-- Badges -->
          <div class="absolute top-4 right-4 flex gap-2 z-50 items-center">
            <div
              class="bg-surface/80 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 text-xs font-bold text-primary uppercase shadow-lg"
            >
              {{ event()!.sport }}
            </div>
            @if (event()!.hasVip) {
              <div
                class="flex items-center bg-vip-gold/20 backdrop-blur-md px-3 py-1 rounded-full border border-vip-gold/50"
              >
                <mat-icon class="text-vip-gold scale-75 mr-1">star</mat-icon>
                <span class="text-vip-gold text-xs font-bold uppercase">VIP</span>
              </div>
            }
          </div>

          <div class="absolute bottom-0 left-0 p-6 w-full">
            <h1 class="text-4xl font-black text-white leading-tight drop-shadow-lg mb-2">
              {{ event()!.title }}
            </h1>
            <div class="flex flex-wrap gap-2">
              @for (tag of event()!.tags; track tag) {
                <span
                  class="text-xs bg-white/10 text-white px-2 py-1 rounded-md border border-white/5 backdrop-blur-sm"
                  >#{{ tag }}</span
                >
              }
            </div>
          </div>
        </div>

        <!-- Content -->
        <div
          class="px-6 pt-6 space-y-8 relative z-10 bg-background -mt-4 rounded-t-3xl max-w-2xl mx-auto"
        >
          <!-- Coach Info -->
          <div
            class="bg-surface-elevated rounded-2xl p-4 border border-white/5 flex items-start shadow-xl"
          >
            <div class="w-16 h-16 rounded-full border-2 border-primary overflow-hidden shrink-0">
              <img [src]="event()!.coach.image" class="w-full h-full object-cover" />
            </div>
            <div class="ml-4">
              <div class="flex items-center">
                <h3 class="text-lg font-bold text-white leading-tight">
                  {{ event()!.coach.name }}
                </h3>
                @if (event()!.coach.isVip) {
                  <mat-icon class="text-vip-gold scale-75 ml-1" title="Coach VIP"
                    >verified</mat-icon
                  >
                }
              </div>
              <div class="flex items-center text-text-secondary text-sm mb-1 mt-0.5">
                <mat-icon class="text-warning scale-[0.7] -ml-1 mr-[-2px]">star</mat-icon>
                <span class="font-bold text-white mr-2">{{ event()!.coach.rating }}</span>
                <span>Coach di {{ event()!.coach.sport }}</span>
              </div>
              <p class="text-sm text-text-primary line-clamp-2 leading-relaxed opacity-90">
                {{ event()!.coach.bio }}
              </p>
            </div>
          </div>

          <!-- Quick Stats -->
          <div class="grid grid-cols-2 gap-3">
            <div
              class="bg-surface rounded-2xl p-4 border border-white/5 flex flex-col items-center text-center"
            >
              <mat-icon class="text-primary mb-2">event</mat-icon>
              <span class="text-white font-medium text-sm">{{
                event()!.date | date: 'dd MMM yyyy'
              }}</span>
              <span class="text-text-secondary text-xs">{{ event()!.date | date: 'HH:mm' }}</span>
            </div>

            <a
              [href]="'https://maps.google.com/?q=' + event()!.location"
              target="_blank"
              class="bg-surface rounded-2xl p-4 border border-white/5 flex flex-col items-center text-center hover:bg-white/5 transition-colors group"
            >
              <mat-icon class="text-accent mb-2 group-hover:scale-110 transition-transform"
                >location_on</mat-icon
              >
              <span class="text-white font-medium text-sm">{{ event()!.location }}</span>
              <span class="text-primary text-xs flex items-center mt-1"
                >Apri mappa <mat-icon class="scale-50 ml-[-4px]">open_in_new</mat-icon></span
              >
            </a>

            <div
              class="bg-surface rounded-2xl p-4 border border-white/5 flex flex-col items-center text-center"
            >
              <mat-icon class="text-primary mb-2">schedule</mat-icon>
              <span class="text-white font-medium text-sm">{{ event()!.duration }} min</span>
              <span class="text-text-secondary text-xs">Durata</span>
            </div>

            <div
              class="bg-surface rounded-2xl p-4 border border-white/5 flex flex-col items-center text-center"
            >
              <mat-icon class="text-accent mb-2">bolt</mat-icon>
              <span class="text-white font-medium text-sm">{{ event()!.experience }}</span>
              <span class="text-text-secondary text-xs">Livello</span>
            </div>
          </div>

          <!-- Event Description -->
          <div>
            <h3 class="text-xl font-bold text-white mb-3 flex items-center">
              <mat-icon class="mr-2 text-primary">description</mat-icon>
              Descrizione
            </h3>
            <p
              class="text-text-primary leading-relaxed text-sm whitespace-pre-line opacity-90 p-4 bg-surface rounded-2xl border border-white/5"
            >
              {{ event()!.description }}
            </p>
          </div>

          <!-- Performance Average (if available) -->
          @if (avgPerformance()) {
            <div
              class="bg-gradient-to-br from-primary/10 to-accent/10 rounded-3xl p-5 border border-white/10 relative overflow-hidden"
            >
              <div
                class="absolute top-[-50%] right-[-10%] w-64 h-64 bg-primary/20 blur-[60px] rounded-full pointer-events-none"
              ></div>

              <div class="flex items-center mb-4 relative z-10">
                <mat-icon class="text-accent mr-2 animate-pulse">insights</mat-icon>
                <h3 class="text-xl font-bold text-white tracking-tight">Prestazioni Medie</h3>
                <span
                  class="ml-auto text-xs font-mono bg-white/10 px-2 py-1 rounded-full text-white border border-white/10"
                  >N={{ avgPerformance()!.participantsCount }}</span
                >
              </div>

              <div class="grid grid-cols-2 gap-3 relative z-10">
                <div
                  class="bg-background/40 backdrop-blur-md rounded-2xl p-4 border border-white/5 flex flex-col items-center justify-center"
                >
                  <div class="text-xs text-text-secondary mb-1 uppercase tracking-widest">
                    FC Media
                  </div>
                  <div class="text-2xl font-black text-white">
                    {{ avgPerformance()!.heartRateAvg }}
                    <span class="text-sm font-medium text-text-secondary">bpm</span>
                  </div>
                </div>
                <div
                  class="bg-background/40 backdrop-blur-md rounded-2xl p-4 border border-white/5 flex flex-col items-center justify-center"
                >
                  <div class="text-xs text-text-secondary mb-1 uppercase tracking-widest">
                    Calorie
                  </div>
                  <div
                    class="text-2xl font-black text-accent drop-shadow-[0_0_10px_rgba(255,107,53,0.5)]"
                  >
                    {{ avgPerformance()!.caloriesBurned }}
                    <span class="text-sm font-medium text-text-secondary">kcal</span>
                  </div>
                </div>
                <div
                  class="bg-background/40 backdrop-blur-md rounded-2xl p-4 border border-white/5 flex flex-col items-center justify-center"
                >
                  <div class="text-xs text-text-secondary mb-1 uppercase tracking-widest">
                    Score
                  </div>
                  <div
                    class="flex items-end text-2xl font-black text-primary drop-shadow-[0_0_10px_rgba(0,212,255,0.5)]"
                  >
                    {{ avgPerformance()!.performanceScore
                    }}<span class="text-sm font-medium text-text-secondary ml-1 mb-0.5">/100</span>
                  </div>
                </div>
                <div
                  class="bg-background/40 backdrop-blur-md rounded-2xl p-4 border border-white/5 flex flex-col items-center justify-center"
                >
                  <div class="text-xs text-text-secondary mb-1 uppercase tracking-widest">
                    Distanza
                  </div>
                  <div class="text-2xl font-black text-white">
                    {{ avgPerformance()!.distanceKm }}
                    <span class="text-sm font-medium text-text-secondary">km</span>
                  </div>
                </div>
              </div>
            </div>
          }
        </div>

        <!-- Sticky Bottom CTA -->
        <div
          class="fixed bottom-0 left-0 right-0 p-4 bg-background/90 backdrop-blur-xl border-t border-white/10 z-50"
        >
          <div class="max-w-2xl mx-auto flex items-center justify-between">
            <div class="flex flex-col">
              <span class="text-text-secondary text-sm"
                >Posti rimanenti: {{ avaliableSpots() }}</span
              >
              <span class="text-3xl font-black text-white">€{{ event()!.cost }}</span>
            </div>

            <button
              mat-flat-button
              [disabled]="isFull()"
              (click)="purchaseTicket()"
              class="!rounded-full px-8 py-7 text-lg font-bold transition-all"
              [ngClass]="
                isFull()
                  ? '!bg-surface !text-text-secondary shadow-none border border-white/5'
                  : '!bg-accent !text-white hover:scale-105 shadow-[0_0_20px_rgba(255,107,53,0.4)]'
              "
            >
              {{ isFull() ? 'Sold Out' : 'Acquista Ticket' }}
            </button>
          </div>
        </div>
      </div>
    }
  `,
})
export class EventDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private eventsService = inject(EventsService);
  private perfService = inject(PerformanceService);

  event = signal<SportEvent | null>(null);
  avgPerformance = signal<PerformanceAverage | null>(null);
  isLoading = signal(true);
  isFull = signal(false);

  scrollY = signal(0);
  private startY = 0;

  readonly avaliableSpots = computed(() => {
    const result = this.event()!.maxParticipants - this.event()!.currentParticipants;
    return result > 0 ? result : 0;
  });

  ngOnInit() {
    window.addEventListener('scroll', this.onWindowScroll.bind(this));

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.eventsService.getEventById(id).subscribe({
        next: (ev) => {
          this.event.set(ev);
          this.isFull.set(ev.currentParticipants >= ev.maxParticipants);
          this.loadAveragePerformance(id);
          this.isLoading.set(false);
        },
        error: () => {
          this.isLoading.set(false);
          this.goBack();
        },
      });
    }
  }

  ngOnDestroy() {
    window.removeEventListener('scroll', this.onWindowScroll.bind(this));
  }

  onWindowScroll() {
    this.scrollY.set(window.scrollY);
  }

  loadAveragePerformance(eventId: string) {
    this.perfService.getEventPerformanceAverage(eventId).subscribe({
      next: (res: any) => {
        if (res && res.average && res.participantsCount > 0) {
          this.avgPerformance.set({ ...res.average, participantsCount: res.participantsCount });
        }
      },
    });
  }

  goBack() {
    this.router.navigate(['/events']);
  }

  purchaseTicket() {
    if (!this.isFull() && this.event()) {
      this.router.navigate(['/purchase', this.event()!.id]);
    }
  }

  onTouchStart(e: TouchEvent) {
    if (window.scrollY <= 0) {
      this.startY = e.touches[0].clientY;
    } else {
      this.startY = 0;
    }
  }

  onTouchEnd(e: TouchEvent) {
    if (this.startY > 0) {
      const delta = e.changedTouches[0].clientY - this.startY;
      if (delta > 100 && window.scrollY <= 0) {
        // Swipe down at the top of the page = go back
        this.goBack();
      }
    }
  }
}
