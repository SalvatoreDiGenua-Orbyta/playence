import { Component, inject, signal, computed, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators, FormGroup } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatDividerModule } from '@angular/material/divider';
import { MatTooltipModule } from '@angular/material/tooltip';
import { WearableService } from '../../../core/services/wearable.service';
import { EventsService } from '../../../core/services/events.service';
import { WearableMetric } from '../../../core/models/wearable.model';

@Component({
  selector: 'app-event-create',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
    MatChipsModule,
    MatIconModule,
    MatSlideToggleModule,
    MatDividerModule,
    MatTooltipModule,
  ],
  templateUrl: './event-create.component.html',
  styleUrls: ['./event-create.component.scss'],
})
export class EventCreateComponent implements OnInit, OnDestroy {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private wearableService = inject(WearableService);
  private eventsService = inject(EventsService);

  eventForm: FormGroup;
  isEditMode = signal(false);
  isPolling = signal(false);
  
  availableMetrics: WearableMetric[] = [
    'heartRate', 'calories', 'distance', 'oxygenSaturation', 'steps', 'temperature', 'performanceScore'
  ];

  sports = ['Calcio', 'Tennis', 'Nuoto', 'Ciclismo', 'Pallacanestro', 'Padel', 'Running', 'Yoga', 'CrossFit'];
  experiences = ['Principiante', 'Intermedio', 'Avanzato', 'Agonistico'];

  // Mock devices for discovery
  detectedDevices = signal([
    { id: 'dev_1', name: 'Garmin Fenix 7', status: 'connected', type: 'garmin' },
    { id: 'dev_2', name: 'Apple Watch Series 9', status: 'pairing', type: 'apple_watch' },
    { id: 'dev_3', name: 'Polar H10', status: 'waiting', type: 'polar' }
  ]);

  constructor() {
    this.eventForm = this.fb.group({
      // Sezione 1 — Info base
      title: ['', [Validators.required, Validators.minLength(5)]],
      sport: ['', Validators.required],
      experience: ['Intermedio', Validators.required],
      description: ['', Validators.maxLength(1000)],
      tags: [[]],

      // Sezione 2 — Logistica
      date: ['', Validators.required],
      startTime: ['', Validators.required],
      durationMinutes: [120, [Validators.required, Validators.min(30)]],
      location: ['', Validators.required],
      address: [''],
      cost: [0, [Validators.required, Validators.min(0)]],
      maxParticipants: [20, [Validators.required, Validators.min(1)]],
      minParticipants: [5, Validators.min(1)],
      hasVip: [false],

      // Sezione 3 — Coach
      coachId: ['', Validators.required],

      // Sezione 4 — Wearable
      wearableEnabled: [true],
      pollingIntervalSeconds: [5],
      metricsToCollect: [['heartRate', 'calories', 'distance', 'performanceScore']],
      participantIds: [[]],
    });
  }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode.set(true);
      // Fetch event and patch form in a real app
    }
  }

  ngOnDestroy() {
    if (this.isPolling()) {
      this.togglePolling();
    }
  }

  toggleTag(tag: string) {
    const tags = this.eventForm.get('tags')?.value as string[];
    const index = tags.indexOf(tag);
    if (index >= 0) {
      tags.splice(index, 1);
    } else {
      tags.push(tag);
    }
    this.eventForm.get('tags')?.setValue([...tags]);
  }

  toggleMetric(metric: WearableMetric) {
    const metrics = this.eventForm.get('metricsToCollect')?.value as WearableMetric[];
    const index = metrics.indexOf(metric);
    if (index >= 0) {
      metrics.splice(index, 1);
    } else {
      metrics.push(metric);
    }
    this.eventForm.get('metricsToCollect')?.setValue([...metrics]);
  }

  togglePolling() {
    this.isPolling.update(v => !v);
    if (this.isPolling()) {
      const eventId = this.route.snapshot.paramMap.get('id') || 'temp_event';
      const interval = this.eventForm.get('pollingIntervalSeconds')?.value;
      this.wearableService.startPolling(eventId, interval);
    } else {
      const eventId = this.route.snapshot.paramMap.get('id') || 'temp_event';
      this.wearableService.stopPolling(eventId);
    }
  }

  onSubmit() {
    if (this.eventForm.valid) {
      console.log('Form Submit:', this.eventForm.value);
      // Here we would call eventsService.create(this.eventForm.value)
      // and navigate back
    }
  }

  goBack() {
    this.router.navigate(['/events']);
  }
}
