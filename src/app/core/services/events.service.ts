import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SportEvent, EventFilters } from '../models/event.model';
import { environment } from '../../../environments/environment';

export interface EventsResponse {
  events: SportEvent[];
  total: number;
}

@Injectable({
  providedIn: 'root'
})
export class EventsService {
  private http = inject(HttpClient);

  getEvents(filters?: EventFilters): Observable<EventsResponse> {
    let params = new HttpParams();
    if (filters) {
      Object.keys(filters).forEach(key => {
        const value = (filters as any)[key];
        if (value !== undefined && value !== null && value !== '') {
          params = params.append(key, value.toString());
        }
      });
    }
    return this.http.get<EventsResponse>(`${environment.apiUrl}/events`, { params });
  }

  getEventById(id: string): Observable<SportEvent> {
    return this.http.get<SportEvent>(`${environment.apiUrl}/events/${id}`);
  }
}
