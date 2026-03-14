import { Component, computed, input, output } from '@angular/core';
import { NgOptimizedImage, DatePipe } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { SportEvent } from '../../../core/models/event.model';

@Component({
  selector: 'app-event-card',
  imports: [MatIconModule, MatChipsModule, NgOptimizedImage, DatePipe],
  host: { class: 'block w-full h-full cursor-pointer snap-center' },
  template: `
    <div
      class="relative w-full h-[85vh] rounded-3xl overflow-hidden shadow-2xl group"
      (click)="cardClick.emit(event().id)"
    >
      <!-- Background Image -->
      <img
        [ngSrc]="event().coverImage"
        fill
        priority
        class="object-cover group-hover:scale-105 transition-transform duration-700"
        alt="Event cover"
      />

      <!-- Gradient Overlay -->
      <div
        class="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent"
      ></div>

      <!-- Top Badges -->
      <div class="absolute top-10 left-4 right-4 flex justify-between items-start z-10">
        <div
          class="bg-surface/80 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 text-xs font-bold font-mono tracking-widest text-primary uppercase shadow-lg"
        >
          {{ event().sport }}
        </div>
        @if (event().hasVip) {
          <div
            class="flex items-center bg-vip-gold/20 backdrop-blur-md px-3 py-1 rounded-full border border-vip-gold/50 shadow-[0_0_15px_rgba(255,215,0,0.3)]"
          >
            <mat-icon class="text-vip-gold scale-75 mr-1">star</mat-icon>
            <span class="text-vip-gold text-xs font-bold uppercase">VIP Coach</span>
          </div>
        }
      </div>

      <!-- Content Bottom -->
      <div class="absolute bottom-0 left-0 right-0 p-6 pb-12 z-10 flex flex-col justify-end">
        <h2 class="text-3xl font-black text-white leading-tight mb-3 drop-shadow-md">
          {{ event().title }}
        </h2>

        <!-- Coach Info -->
        @if (event().coach) {
          <div
            class="flex items-center mb-4 bg-white/5 backdrop-blur-sm p-3 rounded-2xl border border-white/10 w-fit"
          >
            <div class="w-10 h-10 rounded-full border-2 border-primary overflow-hidden mr-3">
              <img [src]="event().coach.image" class="w-full h-full object-cover" />
            </div>
            <div>
              <div class="text-sm font-bold text-white leading-tight">{{ event().coach.name }}</div>
              <div class="text-xs text-white/70 flex items-center">
                <mat-icon class="text-warning scale-[0.6] origin-left">star</mat-icon>
                <span class="ml-[-4px]">{{ event().coach.rating }}</span>
              </div>
            </div>
          </div>
        }

        <!-- Details Row -->
        <div class="flex flex-wrap gap-4 mb-5 text-sm font-semibold text-white/85">
          <div class="flex items-center bg-white/5 px-3 py-1.5 rounded-lg">
            <mat-icon class="scale-75 mr-1 text-primary">calendar_today</mat-icon>
            {{ event().date | date: 'dd MMM yyyy, HH:mm' }}
          </div>
          <div class="flex items-center bg-white/5 px-3 py-1.5 rounded-lg">
            <mat-icon class="scale-75 mr-1 text-primary">location_on</mat-icon>
            {{ event().location }}
          </div>
          <div class="flex items-center bg-white/5 px-3 py-1.5 rounded-lg">
            <mat-icon class="scale-75 mr-1 text-primary">schedule</mat-icon>
            {{ event().duration }} min
          </div>
        </div>

        <div class="flex justify-between items-end">
          <div class="flex-1 mr-4">
            <div class="flex justify-between text-xs text-white/70 mb-1">
              <span
                >Posti disponibili:
                {{ avaliableSpots() }}</span
              >
              <span class="font-mono"
                >{{ event().currentParticipants }}/{{ event().maxParticipants }}</span
              >
            </div>
            <div class="w-full bg-white/10 rounded-full h-2 overflow-hidden">
              <div
                class="bg-accent h-2 rounded-full transition-all duration-500"
                [style.width.%]="(event().currentParticipants / event().maxParticipants) * 100"
              ></div>
            </div>
          </div>
          <div class="text-right">
            <div class="text-[10px] text-white/70 uppercase tracking-widest mb-1">Costo</div>
            <div
              class="text-2xl font-black text-white bg-white/10 px-4 py-1 rounded-xl border border-white/20"
            >
              €{{ event().cost }}
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class EventCardComponent {
  readonly event = input.required<SportEvent>();
  readonly cardClick = output<string>();
  readonly avaliableSpots = computed(() => {
    const result = this.event().maxParticipants - this.event().currentParticipants;
    return result > 0 ? result : 0;
  });
}
