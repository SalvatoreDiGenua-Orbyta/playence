import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import {
  PerformanceData,
  PerformanceAverage,
  AiAnalysisResponse,
  EnrichedPerformance,
} from '../models/performance.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class PerformanceService {
  private http = inject(HttpClient);

  getUserPerformances(userId: string): Observable<PerformanceData[]> {
    return this.http.get<PerformanceData[]>(`${environment.apiUrl}/users/${userId}/performances`);
  }

  getEventPerformanceAverage(eventId: string): Observable<PerformanceAverage> {
    return this.http.get<PerformanceAverage>(
      `${environment.apiUrl}/events/${eventId}/performances/average`,
    );
  }

  getAiAnalysis(
    performanceId: string,
    performanceData: PerformanceData,
  ): Observable<AiAnalysisResponse> {
    return this.http.post<AiAnalysisResponse>(
      `${environment.apiUrl}/performances/${performanceId}/ai-analysis`,
      { performanceData },
    );
  }

  getEnrichedPerformance(performanceId: string): Observable<EnrichedPerformance> {
    return this.http
      .get<EnrichedPerformance>(`${environment.apiUrl}/performances/${performanceId}/enriched`)
      .pipe(
        tap((data) => {
          const cacheKey = `sc_enriched_${performanceId}`;
          const cached = { data, expiresAt: Date.now() + 3600000 };
          localStorage.setItem(cacheKey, JSON.stringify(cached));
        }),
      );
  }

  getCachedOrFetch(performanceId: string): Observable<EnrichedPerformance> {
    const cacheKey = `sc_enriched_${performanceId}`;
    const raw = localStorage.getItem(cacheKey);
    if (raw) {
      try {
        const { data, expiresAt } = JSON.parse(raw);
        if (Date.now() < expiresAt) return of(data);
      } catch (e) {
        localStorage.removeItem(cacheKey);
      }
    }
    return this.getEnrichedPerformance(performanceId);
  }
}
