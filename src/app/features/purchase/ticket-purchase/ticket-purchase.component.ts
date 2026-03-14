import { Component, inject, OnInit, signal, computed } from '@angular/core';

import { FormBuilder, ReactiveFormsModule, Validators, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatDialogModule, MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { EventsService } from '../../../core/services/events.service';
import { AuthService } from '../../../core/services/auth.service';
import { TicketsService } from '../../../core/services/tickets.service';
import { SportEvent } from '../../../core/models/event.model';
import { User } from '../../../core/models/user.model';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-ticket-success-dialog',

  imports: [MatButtonModule, MatIconModule, MatDialogModule, RouterModule],
  template: `
    <div
      class="bg-surface border border-white/10 rounded-2xl p-6 text-center max-w-sm mx-auto shadow-2xl"
    >
      <div
        class="w-20 h-20 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-accent/30 animate-pulse"
      >
        <mat-icon class="scale-[2] text-accent">check_circle</mat-icon>
      </div>
      <h2 class="text-2xl font-black text-white mb-2">Prenotazione Confermata!</h2>
      <p class="text-text-secondary mb-4 text-sm">Il tuo codice prenotazione è:</p>
      <div
        class="bg-background py-3 px-4 rounded-xl border border-white/5 font-mono text-2xl text-primary font-bold tracking-widest mb-6"
      >
        {{ data.code }}
      </div>
      <button
        mat-flat-button
        color="primary"
        [mat-dialog-close]="true"
        class="w-full !rounded-xl py-6 font-bold !bg-primary text-background shadow-[0_0_15px_rgba(0,212,255,0.3)] hover:scale-105 transition-transform text-lg flex items-center justify-center gap-2"
      >
        <mat-icon>history</mat-icon> Vedi Storico
      </button>
    </div>
  `,
})
export class TicketSuccessDialogComponent {
  data = inject(MAT_DIALOG_DATA);
}

@Component({
  selector: 'app-ticket-purchase',

  imports: [
    ReactiveFormsModule,
    RouterModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatSlideToggleModule,
    MatDialogModule,
    DatePipe
  ],
  template: `
    @if (isLoading()) {
      <div class="min-h-screen flex items-center justify-center bg-background">
        <mat-icon class="animate-spin text-accent scale-[2]">autorenew</mat-icon>
      </div>
    } @else if (event()) {
      <div
        class="min-h-screen bg-background text-text-primary px-4 py-6 md:py-12 animate-fade-in relative overflow-hidden"
      >
        <div
          class="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-primary/10 rounded-full blur-[150px] pointer-events-none"
        ></div>
        <div
          class="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] bg-accent/10 rounded-full blur-[100px] pointer-events-none"
        ></div>

        <div class="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8 relative z-10">
          <!-- Left Col: Forms -->
          <div class="lg:col-span-2 space-y-6">
            <div class="flex items-center mb-6">
              <button
                mat-icon-button
                (click)="goBack()"
                class="text-white hover:bg-white/5 mr-2 -ml-2 transition-colors"
              >
                <mat-icon>arrow_back</mat-icon>
              </button>
              <h1 class="text-3xl font-black text-white tracking-tight">Acquisto Ticket</h1>
            </div>

            <!-- Buyer Details -->
            <div class="bg-surface-elevated rounded-3xl p-6 border border-white/5 shadow-xl">
              <h2
                class="text-xl font-bold text-white mb-5 flex items-center pb-3 border-b border-white/5"
              >
                <mat-icon class="text-primary mr-2">person</mat-icon> Intestatario Principale
              </h2>
              <form [formGroup]="buyerForm" class="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div class="relative text-left">
                  <label
                    class="block text-xs font-semibold text-text-secondary mb-1.5 ml-1 uppercase tracking-wider"
                    >Nome Completo</label
                  >
                  <input
                    formControlName="fullName"
                    type="text"
                    class="w-full bg-background border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-primary/50 focus:border-primary transition-shadow"
                  />
                </div>
                <div class="relative text-left">
                  <label
                    class="block text-xs font-semibold text-text-secondary mb-1.5 ml-1 uppercase tracking-wider"
                    >Email</label
                  >
                  <input
                    formControlName="email"
                    type="email"
                    class="w-full bg-background border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-primary/50 focus:border-primary transition-shadow"
                  />
                </div>
                <div class="relative text-left md:col-span-2">
                  <label
                    class="block text-xs font-semibold text-text-secondary mb-1.5 ml-1 uppercase tracking-wider"
                    >Cellulare</label
                  >
                  <input
                    formControlName="phone"
                    type="tel"
                    class="w-full bg-background border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-primary/50 focus:border-primary transition-shadow"
                  />
                </div>
              </form>
            </div>

            <!-- Multi Ticket -->
            <div class="bg-surface-elevated rounded-3xl p-6 border border-white/5 shadow-xl">
              <div
                class="flex items-center justify-between mb-2 pb-3"
                [class.border-b]="isMultiTicket()"
                [class.border-white]="isMultiTicket()"
                [class.border-opacity-5]="isMultiTicket()"
              >
                <div>
                  <h2 class="text-xl font-bold text-white flex items-center">
                    <mat-icon class="text-accent mr-2">group_add</mat-icon> Acquisti per altri?
                  </h2>
                  <p class="text-sm text-text-secondary mt-1">
                    Aggiungi partecipanti per acquistare più posti insieme.
                  </p>
                </div>
                <mat-slide-toggle
                  [checked]="isMultiTicket()"
                  (change)="toggleMultiTicket()"
                  color="accent"
                />
              </div>

              @if (isMultiTicket()) {
                <div class="mt-6 space-y-6">
                  @for (ctrl of extraParticipants.controls; track ctrl; let i = $index) {
                    <div
                      class="bg-background rounded-2xl p-5 border border-white/5 relative group transition-all"
                    >
                      <div
                        class="absolute -top-3 left-4 bg-accent/20 backdrop-blur-md border border-accent/30 text-accent text-xs font-bold px-3 py-1 rounded-md"
                      >
                        Partecipante {{ i + 2 }}
                      </div>
                      <button
                        mat-icon-button
                        (click)="removeParticipant(i)"
                        class="absolute top-2 right-2 text-text-secondary hover:text-red-400 bg-white/5 hover:bg-red-500/10 transition-colors"
                      >
                        <mat-icon>delete</mat-icon>
                      </button>

                      <div
                        [formGroup]="getFormGroup(ctrl)"
                        class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3 text-left"
                      >
                        <div class="relative">
                          <label
                            class="block text-xs font-semibold text-text-secondary mb-1.5 ml-1 uppercase tracking-wider"
                            >Nome e Cognome</label
                          >
                          <input
                            formControlName="fullName"
                            type="text"
                            class="w-full bg-surface border border-white/10 rounded-xl px-4 py-2.5 text-white focus:ring-2 focus:ring-accent/50 focus:border-accent text-sm"
                          />
                        </div>
                        <div class="relative">
                          <label
                            class="block text-xs font-semibold text-text-secondary mb-1.5 ml-1 uppercase tracking-wider"
                            >Email</label
                          >
                          <input
                            formControlName="email"
                            type="email"
                            class="w-full bg-surface border border-white/10 rounded-xl px-4 py-2.5 text-white focus:ring-2 focus:ring-accent/50 focus:border-accent text-sm"
                          />
                        </div>
                      </div>
                    </div>
                  }

                  <button
                    mat-button
                    class="w-full py-6 border-2 border-dashed border-white/10 rounded-2xl text-accent font-bold hover:bg-accent/5 hover:border-accent/30 transition-all flex items-center justify-center text-lg"
                    (click)="addParticipant()"
                  >
                    <mat-icon class="mr-2">add_circle</mat-icon> Aggiungi partecipante
                  </button>
                </div>
              }
            </div>
          </div>

          <!-- Right Col: Summary -->
          <div class="lg:col-span-1">
            <div
              class="bg-surface-elevated rounded-3xl border border-white/5 shadow-2xl overflow-hidden sticky top-24"
            >
              <!-- Event Mini Card -->
              <div class="h-40 relative">
                <img [src]="event()!.coverImage" class="w-full h-full object-cover" />
                <div
                  class="absolute inset-0 bg-gradient-to-t from-surface-elevated via-surface-elevated/40 to-transparent"
                ></div>
                <div class="absolute bottom-4 left-5 right-5 text-white">
                  <div class="text-xs text-primary font-bold uppercase tracking-wider mb-1">
                    {{ event()!.sport }}
                  </div>
                  <div class="font-black text-xl leading-tight truncate line-clamp-2 text-wrap">
                    {{ event()!.title }}
                  </div>
                </div>
              </div>

              <div class="p-6">
                <!-- Summary Details -->
                <div
                  class="space-y-4 text-sm text-text-secondary mb-6 bg-background rounded-2xl p-4 border border-white/5"
                >
                  <div class="flex justify-between items-center">
                    <span class="flex items-center"
                      ><mat-icon class="scale-75 mr-1 text-white">calendar_today</mat-icon>
                      Data</span
                    >
                    <span class="text-white font-bold">{{
                      event()!.date | date: 'dd MMM yyyy'
                    }}</span>
                  </div>
                  <div class="flex justify-between items-center">
                    <span class="flex items-center"
                      ><mat-icon class="scale-75 mr-1 text-white">schedule</mat-icon> Ora</span
                    >
                    <span class="text-white font-bold">{{ event()!.date | date: 'HH:mm' }}</span>
                  </div>
                  <div class="flex justify-between items-center">
                    <span class="flex items-center"
                      ><mat-icon class="scale-75 mr-1 text-white">location_on</mat-icon> Luogo</span
                    >
                    <span class="text-white font-bold truncate max-w-[140px] text-right">{{
                      event()!.location
                    }}</span>
                  </div>
                </div>

                <div
                  class="h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent my-6"
                ></div>

                <!-- Price Breakdown -->
                <div class="space-y-3 mb-6 font-mono text-sm max-w-[90%] mx-auto">
                  <div class="flex justify-between">
                    <span class="text-text-secondary"
                      >Ticket (€{{ event()!.cost }} x {{ totalTickets() }})</span
                    >
                    <span class="text-white">€{{ subtotal().toFixed(2) }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-text-secondary">Commissioni (5%)</span>
                    <span class="text-white">€{{ serviceFee().toFixed(2) }}</span>
                  </div>
                </div>

                <div
                  class="flex justify-between items-end mb-8 bg-gradient-to-br from-primary/10 to-accent/10 p-5 rounded-2xl border border-white/10 shadow-inner"
                >
                  <span class="text-sm text-white/70 uppercase tracking-widest font-black"
                    >Totale</span
                  >
                  <span
                    class="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-text-secondary"
                    >€{{ totalAmount().toFixed(2) }}</span
                  >
                </div>

                <!-- Checkout CTA -->
                <button
                  mat-flat-button
                  [disabled]="!isFormValid() || isPurchasing()"
                  (click)="submitPurchase()"
                  class="w-full !rounded-2xl py-7 text-xl font-black transition-all disabled:opacity-50 disabled:cursor-not-allowed group border border-white/5 relative overflow-hidden !bg-accent !text-white hover:shadow-[0_0_25px_rgba(255,107,53,0.5)]"
                >
                  <div class="flex items-center justify-center relative z-10">
                    @if (isPurchasing()) {
                      <mat-icon class="animate-spin mr-2">autorenew</mat-icon> Elaborazione
                    } @else {
                      Completa Acquisto
                    }
                  </div>
                </button>
                <div
                  class="text-center mt-4 text-xs font-medium text-text-secondary/60 flex items-center justify-center uppercase tracking-widest"
                >
                  <mat-icon class="scale-[0.6] mr-0 text-success">lock</mat-icon> Checkout Sicuro
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    }
  `,
})
export class TicketPurchaseComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private eventsService = inject(EventsService);
  private authService = inject(AuthService);
  private ticketsService = inject(TicketsService);
  private fb = inject(FormBuilder);
  private dialog = inject(MatDialog);

  event = signal<SportEvent | null>(null);
  user = signal<User | null>(null);
  isLoading = signal(true);
  isMultiTicket = signal(false);
  isPurchasing = signal(false);

  buyerForm = this.fb.group({
    fullName: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    phone: ['', Validators.required],
  });

  extraParticipants = this.fb.array([]);

  totalTickets = computed(() => 1 + this.extraParticipants.length);
  subtotal = computed(() => {
    const ev = this.event();
    return ev ? ev.cost * this.totalTickets() : 0;
  });
  serviceFee = computed(() => {
    return Math.round(this.subtotal() * 0.05 * 100) / 100;
  });
  totalAmount = computed(() => {
    return this.subtotal() + this.serviceFee();
  });

  ngOnInit() {
    this.user.set(this.authService.currentUser());
    if (this.user()) {
      this.buyerForm.patchValue({
        fullName: this.user()?.name,
        email: this.user()?.email,
        phone: this.user()?.phone,
      });
    }

    const id = this.route.snapshot.paramMap.get('eventId');
    if (id) {
      this.eventsService.getEventById(id).subscribe({
        next: (ev) => {
          this.event.set(ev);
          this.isLoading.set(false);
        },
        error: () => {
          this.isLoading.set(false);
          this.router.navigate(['/events']);
        },
      });
    }
  }

  goBack() {
    this.router.navigate(['/events', this.event()?.id]);
  }

  toggleMultiTicket() {
    this.isMultiTicket.update((v) => !v);
    if (!this.isMultiTicket()) {
      this.extraParticipants.clear();
    } else if (this.extraParticipants.length === 0) {
      this.addParticipant();
    }
  }

  addParticipant() {
    this.extraParticipants.push(
      this.fb.group({
        fullName: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
      }) as any,
    );
  }

  removeParticipant(index: number) {
    this.extraParticipants.removeAt(index);
    if (this.extraParticipants.length === 0) {
      this.isMultiTicket.set(false);
    }
  }

  getFormGroup(ctrl: any): FormGroup {
    return ctrl as FormGroup;
  }

  isFormValid(): boolean {
    return this.buyerForm.valid && (!this.isMultiTicket() || this.extraParticipants.valid);
  }

  splitName(fullName: string) {
    const parts = fullName.trim().split(' ');
    const firstName = parts[0];
    const lastName = parts.length > 1 ? parts.slice(1).join(' ') : '';
    return { firstName, lastName };
  }

  submitPurchase() {
    if (!this.isFormValid() || !this.event() || !this.user()) return;

    this.isPurchasing.set(true);

    const buyerName = this.splitName(this.buyerForm.value.fullName || '');
    const participants = [
      {
        firstName: buyerName.firstName,
        lastName: buyerName.lastName,
        email: this.buyerForm.value.email || '',
        phone: this.buyerForm.value.phone || '',
      },
    ];

    if (this.isMultiTicket()) {
      this.extraParticipants.controls.forEach((ctrl) => {
        const pName = this.splitName(ctrl.get('fullName')?.value || '');
        participants.push({
          firstName: pName.firstName,
          lastName: pName.lastName,
          email: ctrl.get('email')?.value || '',
          phone: '', // Extra participants might not have phone
        });
      });
    }

    const request = {
      eventId: this.event()!.id,
      userId: this.user()!.id,
      participants,
    };

    this.ticketsService.purchaseTickets(request).subscribe({
      next: (res) => {
        this.isPurchasing.set(false);
        const dialogRef = this.dialog.open(TicketSuccessDialogComponent, {
          data: { code: res.confirmationCode },
          disableClose: true,
          panelClass: ['bg-surface', 'border', 'border-white/10', 'rounded-2xl'], // override default dialog styles to match theme
        });

        dialogRef.afterClosed().subscribe(() => {
          this.router.navigate(['/profile/history']);
        });
      },
      error: () => {
        this.isPurchasing.set(false);
        alert("Errore durante l'acquisto.");
      },
    });
  }
}
