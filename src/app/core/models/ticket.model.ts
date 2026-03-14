export interface Participant {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

export interface TicketPurchaseRequest {
  eventId: string;
  userId: string;
  participants: Participant[];
}

export interface Ticket {
  id: string;
  eventId: string;
  userId: string;
  participant: Participant;
  purchasedAt: string;
  status: 'confirmed' | 'pending' | 'cancelled';
  confirmationCode: string;
}
