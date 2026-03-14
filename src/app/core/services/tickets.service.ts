import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TicketPurchaseRequest, Ticket } from '../models/ticket.model';
import { environment } from '../../../environments/environment';

export interface TicketPurchaseResponse {
  tickets: Ticket[];
  confirmationCode: string;
}

@Injectable({
  providedIn: 'root'
})
export class TicketsService {
  private http = inject(HttpClient);

  purchaseTickets(request: TicketPurchaseRequest): Observable<TicketPurchaseResponse> {
    return this.http.post<TicketPurchaseResponse>(`${environment.apiUrl}/tickets`, request);
  }

  getUserTickets(userId: string): Observable<Ticket[]> {
    return this.http.get<Ticket[]>(`${environment.apiUrl}/users/${userId}/tickets`);
  }
}
