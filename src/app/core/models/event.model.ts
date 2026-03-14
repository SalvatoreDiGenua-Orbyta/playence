export interface Coach {
  id: string;
  name: string;
  sport: string;
  bio: string;
  isVip: boolean;
  image: string;
  rating: number;
}

export interface SportEvent {
  id: string;
  title: string;
  sport: string;
  cost: number;
  date: string;
  duration: number; // minutes
  location: string;
  experience: 'Principiante' | 'Intermedio' | 'Avanzato' | 'Agonistico';
  hasVip: boolean;
  maxParticipants: number;
  currentParticipants: number;
  description: string;
  image: string;
  coverImage: string;
  tags: string[];
  coach: Coach;
}

export interface EventFilters {
  sport?: string;
  minCost?: number;
  maxCost?: number;
  experience?: string;
  location?: string;
  hasVip?: boolean;
  dateFrom?: string;
  dateTo?: string;
  duration?: number;
}
