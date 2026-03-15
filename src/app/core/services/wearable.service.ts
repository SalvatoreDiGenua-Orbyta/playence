import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subscription, interval, of } from 'rxjs';
import { switchMap, tap, finalize } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { WearableSession, WearableReading, AggregatedMetrics } from '../models/wearable.model';

@Injectable({ providedIn: 'root' })
export class WearableService {
  private http = inject(HttpClient);
  private pollingSubscription?: Subscription;
  private sessionSignal = signal<WearableSession | null>(null);

  readonly session = this.sessionSignal.asReadonly();

  startPolling(eventId: string, intervalSeconds: number): void {
    if (this.pollingSubscription) return;

    this.http
      .post<WearableSession>(`${environment.apiUrl}/wearable/sessions`, {
        eventId,
        pollingIntervalSeconds: intervalSeconds,
      })
      .subscribe((session) => {
        this.sessionSignal.set(session);

        this.pollingSubscription = interval(intervalSeconds * 1000)
          .pipe(
            switchMap(() => this.generateMockReadings(session.id)),
            switchMap((readings) =>
              this.http.post<{ saved: number }>(`${environment.apiUrl}/wearable/readings`, {
                sessionId: session.id,
                readings,
              }),
            ),
            // After sending, we might want to refresh the session state or aggregated metrics
            switchMap(() =>
              this.http.get<AggregatedMetrics>(
                `${environment.apiUrl}/wearable/sessions/${session.id}/aggregate`,
              ),
            ),
          )
          .subscribe((metrics) => {
            // In a real app, we'd update the session with new readings or metrics
            console.log('Metrics updated:', metrics);
          });
      });
  }

  stopPolling(eventId: string): void {
    if (this.pollingSubscription) {
      this.pollingSubscription.unsubscribe();
      this.pollingSubscription = undefined;
    }

    const currentSession = this.sessionSignal();
    if (currentSession) {
      this.http
        .patch<WearableSession>(`${environment.apiUrl}/wearable/sessions/${currentSession.id}`, {
          status: 'completed',
          endedAt: new Date().toISOString(),
        })
        .subscribe((updatedSession) => {
          this.sessionSignal.set(updatedSession);
        });
    }
  }

  private generateMockReadings(sessionId: string): Observable<WearableReading[]> {
    // Mock logic to generate readings for 1-3 participants
    const participants = ['user_1', 'user_2'];
    const readings: WearableReading[] = participants.map((pid) => ({
      participantId: pid,
      deviceId: `dev_${pid}`,
      deviceType: 'garmin',
      timestamp: new Date().toISOString(),
      heartRate: 120 + Math.floor(Math.random() * 40),
      calories: Math.floor(Math.random() * 10),
      distanceKm: +(Math.random() * 0.1).toFixed(2),
      performanceScore: 60 + Math.floor(Math.random() * 30),
    }));
    return of(readings);
  }
}
