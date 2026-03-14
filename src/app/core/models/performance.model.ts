export interface PerformanceData {
  id: string;
  userId: string;
  eventId: string;
  heartRateAvg: number;
  heartRateMax: number;
  caloriesBurned: number;
  distanceKm: number;
  durationMinutes: number;
  coachComment: string;
  aiAnalysis: string;
  performanceScore: number; // 0-100
  date: string;
}

export interface PerformanceAverage {
  heartRateAvg: number;
  caloriesBurned: number;
  distanceKm: number;
  performanceScore: number;
  participantsCount: number;
}

export interface TrainingPlan {
  week: number;
  focus: string;
  sessions: string[];
}

export interface AiAnalysisResponse {
  analysis: string;
  trainingPlan: TrainingPlan[];
  suggestions: string[];
}
