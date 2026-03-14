export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  preferredSports: string[];
  createdAt: string; // ISO date
  avatar?: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}
