import { Component, inject, OnInit, signal } from '@angular/core';

import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatExpansionModule } from '@angular/material/expansion';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartData } from 'chart.js';
import { PerformanceService } from '../../../core/services/performance.service';
import { AuthService } from '../../../core/services/auth.service';
import { StorageService } from '../../../core/services/storage.service';
import {
  AiAnalysisResponse,
  PerformanceAverage,
  PerformanceData,
  EnrichedPerformance,
} from '../../../core/models/performance.model';

@Component({
  selector: 'app-performance-detail',

  imports: [
    RouterModule,
    MatIconModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatExpansionModule,
    BaseChartDirective,
  ],
  template: `
    <div class="max-w-5xl mx-auto p-4 sm:p-6 lg:p-8 animate-fade-in relative min-h-screen">
      <div class="flex items-center mb-8 relative z-10">
        <button mat-icon-button (click)="goBack()" class="text-white hover:bg-white/5 mr-2 -ml-2">
          <mat-icon>arrow_back</mat-icon>
        </button>
        <h1 class="text-3xl font-black text-white tracking-tight">Analisi Performance</h1>
      </div>

      @if (isLoading()) {
        <div class="flex items-center justify-center p-20">
          <mat-spinner diameter="48" class="!stroke-accent" />
        </div>
      } @else if (performance()) {
        @if (!isDataVisible()) {
          <!-- 6-Month Block Overlay -->
          <div
            class="absolute inset-0 z-50 bg-background/80 backdrop-blur-md flex items-center justify-center p-4"
          >
            <div
              class="bg-surface-elevated border border-white/10 rounded-3xl p-8 max-w-md text-center shadow-2xl relative overflow-hidden"
            >
              <div
                class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-vip-gold to-accent"
              ></div>
              <div
                class="w-20 h-20 bg-vip-gold/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-vip-gold/30"
              >
                <mat-icon class="scale-[2] text-vip-gold">lock</mat-icon>
              </div>
              <h3 class="text-2xl font-black text-white mb-3">Archivio Premium</h3>
              <p class="text-text-secondary disabled mb-8">
                Questo resoconto è più vecchio di 6 mesi. Passa a Premium per accedere a tutto il
                tuo storico performance illimitato e analisi AI avanzate.
              </p>
              <button
                mat-flat-button
                class="w-full !rounded-xl py-6 text-lg font-bold !bg-vip-gold text-background shadow-[0_0_20px_rgba(255,215,0,0.3)] hover:scale-105 transition-transform"
              >
                Sblocca Premium
              </button>
            </div>
          </div>
        }

        <div
          class="space-y-8"
          [class.opacity-30]="!isDataVisible()"
          [class.blur-sm]="!isDataVisible()"
          [class.pointer-events-none]="!isDataVisible()"
        >
          <!-- Stats Grid -->
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div class="bg-surface border border-white/5 rounded-2xl p-5 text-center shadow-lg">
              <mat-icon class="text-accent mb-2 scale-150">favorite</mat-icon>
              <div class="text-3xl font-black text-white">
                {{ performance()!.heartRateAvg
                }}<span class="text-sm text-text-secondary font-medium ml-1">bpm</span>
              </div>
              <div class="text-xs text-text-secondary mt-1 uppercase tracking-widest">FC Media</div>
            </div>
            <div class="bg-surface border border-white/5 rounded-2xl p-5 text-center shadow-lg">
              <mat-icon class="text-primary mb-2 scale-150">local_fire_department</mat-icon>
              <div class="text-3xl font-black text-white">
                {{ performance()!.caloriesBurned
                }}<span class="text-sm text-text-secondary font-medium ml-1">kcal</span>
              </div>
              <div class="text-xs text-text-secondary mt-1 uppercase tracking-widest">Calorie</div>
            </div>
            <div class="bg-surface border border-white/5 rounded-2xl p-5 text-center shadow-lg">
              <mat-icon class="text-white mb-2 scale-150">speed</mat-icon>
              <div class="text-3xl font-black text-white">
                {{ performance()!.distanceKm
                }}<span class="text-sm text-text-secondary font-medium ml-1">km</span>
              </div>
              <div class="text-xs text-text-secondary mt-1 uppercase tracking-widest">Distanza</div>
            </div>
            <div
              class="bg-gradient-to-br from-primary/20 to-accent/20 border border-white/10 rounded-2xl p-5 text-center shadow-lg transform hover:scale-105 transition-transform"
            >
              <mat-icon
                class="text-vip-gold mb-2 scale-150 drop-shadow-[0_0_10px_rgba(255,215,0,0.5)]"
                >emoji_events</mat-icon
              >
              <div class="text-3xl font-black text-white drop-shadow-md">
                {{ performance()!.performanceScore
                }}<span class="text-sm text-white/70 font-medium ml-1">/100</span>
              </div>
              <div class="text-xs text-white/80 mt-1 uppercase tracking-widest font-bold">
                Score VIP
              </div>
            </div>
          </div>

          <!-- Timelines Section -->
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div class="bg-surface-elevated border border-white/5 rounded-3xl p-6 shadow-xl relative overflow-hidden">
               <div class="absolute top-4 right-4"><mat-icon class="text-primary/20 scale-150">favorite</mat-icon></div>
               <h3 class="text-lg font-bold text-white mb-6">Timeline Frequenza Cardiaca</h3>
               <div class="h-64 w-full">
                <canvas baseChart [data]="heartRateChartData" [options]="lineChartOptions" [type]="'line'"></canvas>
              </div>
            </div>
            <div class="bg-surface-elevated border border-white/5 rounded-3xl p-6 shadow-xl relative overflow-hidden">
               <div class="absolute top-4 right-4"><mat-icon class="text-accent/20 scale-150">local_fire_department</mat-icon></div>
               <h3 class="text-lg font-bold text-white mb-6">Timeline Calorie</h3>
               <div class="h-64 w-full">
                <canvas baseChart [data]="caloriesChartData" [options]="lineChartOptions" [type]="'line'"></canvas>
              </div>
            </div>
          </div>

          <!-- n8n Enrichment Section -->
          <div class="bg-surface-elevated border-2 border-[#ffd60033] rounded-3xl overflow-hidden shadow-2xl relative">
            <!-- Badge n8n -->
            <div class="absolute top-6 right-6 flex items-center bg-[#1a1a0a] border border-[#ffd60033] rounded-full px-4 py-1.5">
               <div class="w-1.5 h-1.5 bg-warning rounded-full mr-2 animate-pulse"></div>
               <span class="text-[10px] font-black text-warning uppercase tracking-widest">Elaborato da n8n workflow</span>
            </div>

            <div class="p-8 border-b border-white/5">
               <h2 class="text-2xl font-black text-white flex items-center">
                 <mat-icon class="text-warning mr-3">insights</mat-icon> AI Performance Insight
               </h2>
               <p class="text-sm text-text-secondary mt-1">Analisi avanzata generata via n8n + LLM</p>
            </div>

            <div class="p-8 grid grid-cols-1 md:grid-cols-3 gap-8">
               <!-- Percentile -->
               <div class="space-y-4">
                  <div class="text-xs font-bold text-text-secondary uppercase tracking-widest">Percentile Rank</div>
                  <div class="flex items-baseline gap-2">
                    <span class="text-5xl font-black text-white italic">{{ performance()!.n8nEnrichment.percentileRank }}</span>
                    <span class="text-xl font-bold text-text-secondary">%</span>
                  </div>
                  <div class="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                    <div class="h-full bg-warning transition-all" [style.width.%]="performance()!.n8nEnrichment.percentileRank"></div>
                  </div>
                  <p class="text-[10px] text-text-secondary leading-tight italic">Top {{ 100 - performance()!.n8nEnrichment.percentileRank }}% dei partecipanti</p>
               </div>

               <!-- Confronto -->
               <div class="space-y-4">
                  <div class="text-xs font-bold text-text-secondary uppercase tracking-widest">Confronto Eventi Simili</div>
                  <div class="flex items-center gap-3">
                    <div class="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center">
                       <mat-icon [class.text-success]="performance()!.n8nEnrichment.similarEventsComparison.delta >= 0"
                                [class.text-red-400]="performance()!.n8nEnrichment.similarEventsComparison.delta < 0">
                         {{ performance()!.n8nEnrichment.similarEventsComparison.delta >= 0 ? 'arrow_upward' : 'arrow_downward' }}
                       </mat-icon>
                    </div>
                    <div>
                      <div class="text-2xl font-black text-white italic">
                        {{ performance()!.n8nEnrichment.similarEventsComparison.delta > 0 ? '+' : '' }}{{ performance()!.n8nEnrichment.similarEventsComparison.delta }}
                      </div>
                      <div class="text-[10px] text-text-secondary uppercase">Diff. vs Media ({{ performance()!.n8nEnrichment.similarEventsComparison.avgScore }})</div>
                    </div>
                  </div>
               </div>

               <!-- Meteo -->
               <div class="space-y-4">
                  <div class="text-xs font-bold text-text-secondary uppercase tracking-widest">Condizioni Meteo</div>
                  <div class="flex items-center gap-4 bg-background/50 p-4 rounded-2xl border border-white/5">
                    <mat-icon class="text-primary scale-125">wb_sunny</mat-icon>
                    <div>
                      <div class="text-lg font-black text-white">{{ performance()!.n8nEnrichment.weatherConditions?.temperature }}°C</div>
                      <div class="text-[10px] text-text-secondary uppercase">{{ performance()!.n8nEnrichment.weatherConditions?.conditions }} · {{ performance()!.n8nEnrichment.weatherConditions?.humidity }}% umidità</div>
                    </div>
                  </div>
               </div>
            </div>

            <!-- LLM Insights columns -->
            <div class="px-8 pb-8 grid grid-cols-1 md:grid-cols-2 gap-8">
               <div class="bg-success/5 border border-success/20 rounded-2xl p-6">
                 <h4 class="text-sm font-black text-success uppercase tracking-widest mb-4 flex items-center">
                   <mat-icon class="mr-2 text-sm">trending_up</mat-icon> Punti di Forza
                 </h4>
                 <ul class="space-y-3">
                   @for (strength of performance()!.n8nEnrichment.llmInsights.strengthPoints; track strength) {
                     <li class="group flex items-start gap-3">
                        <mat-icon class="text-success scale-75 mt-0.5 shrink-0">check_circle_outline</mat-icon>
                        <span class="text-xs text-white/80 leading-relaxed">{{ strength }}</span>
                     </li>
                   }
                 </ul>
               </div>
               <div class="bg-accent/5 border border-accent/20 rounded-2xl p-6">
                 <h4 class="text-sm font-black text-accent uppercase tracking-widest mb-4 flex items-center">
                   <mat-icon class="mr-2 text-sm">report_problem</mat-icon> Aree di Miglioramento
                 </h4>
                 <ul class="space-y-3">
                   @for (area of performance()!.n8nEnrichment.llmInsights.improvementAreas; track area) {
                     <li class="group flex items-start gap-3">
                        <mat-icon class="text-accent scale-75 mt-0.5 shrink-0">info_outline</mat-icon>
                        <span class="text-xs text-white/80 leading-relaxed">{{ area }}</span>
                     </li>
                   }
                 </ul>
               </div>
            </div>

            <!-- Motivational Message -->
            <div class="mx-8 mb-8 p-6 bg-primary/10 border border-primary/20 rounded-2xl text-center">
               <p class="text-primary font-black italic tracking-wide">"{{ performance()!.n8nEnrichment.llmInsights.motivationalMessage }}"</p>
            </div>
          </div>

          <!-- Coach Comments -->
          <div
            class="bg-surface-elevated border border-white/5 rounded-3xl p-6 shadow-xl flex gap-4"
          >
            <div
              class="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center shrink-0 border border-primary/30"
            >
              <mat-icon class="text-primary">format_quote</mat-icon>
            </div>
            <div>
              <h3 class="text-lg font-bold text-white mb-2">Commento del Coach</h3>
              <p class="text-text-secondary italic leading-relaxed">
                "{{ performance()!.coachComment }}"
              </p>
            </div>
          </div>

          <!-- AI Analysis Section -->
          <div
            class="bg-gradient-to-br from-surface to-surface-elevated border border-white/10 rounded-3xl overflow-hidden shadow-2xl relative"
          >
            <div
              class="absolute top-0 right-0 w-64 h-64 bg-accent/10 rounded-full blur-[80px] pointer-events-none"
            ></div>

            <div
              class="p-6 md:p-8 border-b border-white/5 relative z-10 flex items-center justify-between"
            >
              <div class="flex items-center">
                <div
                  class="w-12 h-12 bg-gradient-to-tr from-accent to-primary rounded-xl flex items-center justify-center mr-4 shadow-lg animate-pulse"
                >
                  <mat-icon class="text-white">auto_awesome</mat-icon>
                </div>
                <div>
                  <h2 class="text-2xl font-black text-white">Analisi AI Avanzata</h2>
                  <p class="text-sm text-text-secondary mt-1">Elaborata sui tuoi dati biometrici</p>
                </div>
              </div>
            </div>

            @if (aiLoading()) {
              <div class="p-12 flex flex-col items-center justify-center">
                <mat-spinner diameter="40" class="!stroke-primary mb-4" />
                <p class="text-text-secondary text-sm animate-pulse">
                  L'AI sta analizzando i tuoi dati...
                </p>
              </div>
            } @else if (aiAnalysis()) {
              <div class="p-6 md:p-8 relative z-10 space-y-8">
                <!-- Analysis Text -->
                <div class="bg-background/50 rounded-2xl p-5 border border-white/5">
                  <p class="text-white/90 leading-relaxed">{{ aiAnalysis()!.analysis }}</p>
                </div>

                <!-- Suggestions -->
                <div>
                  <h3 class="text-lg font-bold text-white mb-4 flex items-center">
                    <mat-icon class="text-accent mr-2">lightbulb</mat-icon> Suggerimenti Pratici
                  </h3>
                  <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                    @for (sug of aiAnalysis()!.suggestions; track sug) {
                      <div class="bg-surface rounded-xl p-4 border border-white/5 flex items-start">
                        <mat-icon class="text-success scale-75 mr-2 mt-0.5 shrink-0"
                          >check_circle</mat-icon
                        >
                        <span class="text-sm text-text-secondary">{{ sug }}</span>
                      </div>
                    }
                  </div>
                </div>

                <!-- Training Plan Accordion -->
                <div>
                  <h3 class="text-lg font-bold text-white mb-4 flex items-center">
                    <mat-icon class="text-primary mr-2">calendar_month</mat-icon> Piano di
                    Allenamento Consigliato
                  </h3>
                  <mat-accordion class="w-full !space-y-2" multi>
                    @for (plan of aiAnalysis()!.trainingPlan; track plan.week) {
                      <mat-expansion-panel
                        class="!bg-surface !border !border-white/5 !shadow-none !rounded-xl !mb-2"
                      >
                        <mat-expansion-panel-header class="hover:!bg-white/5 transition-colors">
                          <mat-panel-title class="!text-white font-bold"
                            >Settimana {{ plan.week }}</mat-panel-title
                          >
                          <mat-panel-description
                            class="!text-text-secondary text-sm hidden sm:block"
                            >{{ plan.focus }}</mat-panel-description
                          >
                        </mat-expansion-panel-header>

                        <div class="pt-4 pb-2 border-t border-white/5">
                          <div
                            class="font-medium text-text-secondary text-xs uppercase tracking-widest mb-3 sm:hidden"
                          >
                            {{ plan.focus }}
                          </div>
                          <ul
                            class="space-y-3 relative before:absolute before:inset-y-0 before:left-[11px] before:w-px before:bg-white/10"
                          >
                            @for (session of plan.sessions; track session) {
                              <li class="pl-8 relative">
                                <span
                                  class="absolute left-2 top-2 w-1.5 h-1.5 rounded-full bg-accent ring-4 ring-surface"
                                ></span>
                                <span class="text-white text-sm">{{ session }}</span>
                              </li>
                            }
                          </ul>
                        </div>
                      </mat-expansion-panel>
                    }
                  </mat-accordion>
                </div>
              </div>
            }
          </div>
        </div>
      }
    </div>
  `,
})
export class PerformanceDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private perfService = inject(PerformanceService);
  private authService = inject(AuthService);
  private storage = inject(StorageService);

  performance = signal<EnrichedPerformance | null>(null);
  avgData = signal<PerformanceAverage | null>(null);
  aiAnalysis = signal<AiAnalysisResponse | null>(null);

  isLoading = signal(true);
  aiLoading = signal(false);
  isDataVisible = signal(true);

  // Charts Config
  public lineChartOptions: ChartConfiguration<'line'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      y: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#8888AA' } },
      x: { grid: { display: false }, ticks: { color: '#8888AA' } },
    },
    elements: { line: { tension: 0.4 }, point: { radius: 0 } },
  };
  public heartRateChartData!: ChartData<'line'>;
  public caloriesChartData!: ChartData<'line'>;

  public barChartOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { position: 'bottom', labels: { color: '#F0F0F5' } } },
    scales: {
      y: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#8888AA' } },
      x: { grid: { display: false }, ticks: { color: '#8888AA' } },
    },
  };
  public comparisonChartData!: ChartData<'bar'>;

  ngOnInit() {
    const performanceId = this.route.snapshot.paramMap.get('performanceId');
    const user = this.authService.currentUser();

    if (performanceId && user) {
      this.perfService.getCachedOrFetch(performanceId).subscribe({
        next: (perf) => {
          this.performance.set(perf);
          this.checkVisibility(perf.date, user.createdAt);
          if (this.isDataVisible()) {
            this.setupTimelines(perf);
            this.loadGroupAverage(perf.eventId, perf);
            
            // Map the enriched data to the aiAnalysis signal expected by the template
            this.aiAnalysis.set({
              analysis: perf.aiAnalysis,
              trainingPlan: perf.trainingPlan,
              suggestions: perf.suggestions
            });
          }
          this.isLoading.set(false);
        },
        error: () => this.isLoading.set(false),
      });
    } else {
      this.isLoading.set(false);
    }
  }

  checkVisibility(eventDateIso: string, userCreatedDateIso: string) {
    const now = new Date();
    const eDate = new Date(eventDateIso);
    const uDate = new Date(userCreatedDateIso);

    const monthDiff = (d1: Date, d2: Date) => {
      let months;
      months = (d2.getFullYear() - d1.getFullYear()) * 12;
      months -= d1.getMonth();
      months += d2.getMonth();
      return months <= 0 ? 0 : months;
    };

    const accountAge = monthDiff(uDate, now);
    const eventAge = monthDiff(eDate, now);

    // Per rules: diff < 6 is visible
    if (accountAge < 6 || eventAge < 6) {
      this.isDataVisible.set(true);
    } else {
      this.isDataVisible.set(false);
    }
  }

  setupTimelines(perf: EnrichedPerformance) {
    this.heartRateChartData = {
      labels: perf.wearableData.heartRateTimeline.map(t => `${t.minute}m`),
      datasets: [
        {
          data: perf.wearableData.heartRateTimeline.map(t => t.bpm),
          borderColor: '#00D4FF',
          backgroundColor: 'rgba(0,212,255,0.1)',
          fill: true,
          label: 'Frequenza Cardiaca (bpm)'
        },
      ],
    };

    this.caloriesChartData = {
      labels: perf.wearableData.caloriesTimeline.map(t => `${t.minute}m`),
      datasets: [
        {
          data: perf.wearableData.caloriesTimeline.map(t => t.kcal),
          borderColor: '#FF6B35',
          backgroundColor: 'rgba(255,107,53,0.1)',
          fill: true,
          label: 'Calorie (kcal)'
        },
      ],
    };
  }

  loadGroupAverage(eventId: string, perf: PerformanceData) {
    this.perfService.getEventPerformanceAverage(eventId).subscribe((res) => {
      if (res && res.participantsCount > 0) {
        this.avgData.set(res);

        // Normalize comparison data roughly for Chart display
        // We'll just show actual numbers but grouped
        this.comparisonChartData = {
          labels: ['Score (x10)', 'Calorie (x1)', 'Distanza (x10)', 'FC Media (x10)'],
          datasets: [
            {
              label: 'Tu',
              data: [
                perf.performanceScore * 10,
                perf.caloriesBurned,
                perf.distanceKm * 10,
                perf.heartRateAvg * 10,
              ],
              backgroundColor: '#FF6B35',
              borderRadius: 4,
            },
            {
              label: 'Media Gruppo',
              data: [
                res.performanceScore * 10,
                res.caloriesBurned,
                res.distanceKm * 10,
                res.heartRateAvg * 10,
              ],
              backgroundColor: '#00D4FF',
              borderRadius: 4,
            },
          ],
        };
      }
    });
  }

  loadAiAnalysis(perf: PerformanceData) {
    this.aiLoading.set(true);
    this.perfService.getAiAnalysis(perf.id, perf).subscribe((res) => {
      this.aiAnalysis.set(res);
      this.aiLoading.set(false);
    });
  }

  goBack() {
    this.router.navigate(['/profile/history']);
  }
}
