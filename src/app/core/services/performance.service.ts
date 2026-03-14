import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PerformanceData, PerformanceAverage, AiAnalysisResponse } from '../models/performance.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PerformanceService {
  private http = inject(HttpClient);

  getUserPerformances(userId: string): Observable<PerformanceData[]> {
    return this.http.get<PerformanceData[]>(`${environment.apiUrl}/users/${userId}/performances`);
  }

  getEventPerformanceAverage(eventId: string): Observable<PerformanceAverage> {
    return this.http.get<PerformanceAverage>(`${environment.apiUrl}/events/${eventId}/performances/average`);
  }

  getAiAnalysis(performanceId: string, performanceData: PerformanceData): Observable<AiAnalysisResponse> {
    return this.http.post<AiAnalysisResponse>(`${environment.apiUrl}/performances/${performanceId}/ai-analysis`, { performanceData });
  }
}
