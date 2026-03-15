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
export interface EnrichedPerformance extends PerformanceData {
  // Dati wearable aggregati dalla sessione
  wearableData: {
    sessionId: string;
    readingsCount: number;
    deviceTypes: string[];
    heartRateTimeline: { minute: number; bpm: number }[];
    caloriesTimeline: { minute: number; kcal: number }[];
  };

  // Elaborati da n8n
  n8nEnrichment: {
    processedAt: string;
    workflowId: string;
    percentileRank: number;             // 0–100: posizione vs altri utenti
    similarEventsComparison: {
      avgScore: number;
      userScore: number;
      delta: number;
    };
    weatherConditions?: {
      temperature: number;
      humidity: number;
      conditions: string;
    };
    llmInsights: {
      strengthPoints: string[];         // max 3
      improvementAreas: string[];       // max 3
      motivationalMessage: string;
    };
  };

  // Già esistenti
  aiAnalysis: string;
  trainingPlan: TrainingPlan[];
  suggestions: string[];
}
