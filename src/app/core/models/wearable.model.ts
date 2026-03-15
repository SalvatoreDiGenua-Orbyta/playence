export type WearableMetric =
  | 'heartRate'
  | 'calories'
  | 'distance'
  | 'oxygenSaturation'
  | 'steps'
  | 'temperature'
  | 'performanceScore';

export interface WearableReading {
  participantId: string;
  deviceId: string;
  deviceType: 'garmin' | 'apple_watch' | 'polar' | 'fitbit' | 'generic';
  timestamp: string; // ISO datetime
  heartRate?: number;
  calories?: number;
  distanceKm?: number;
  oxygenSaturation?: number;
  steps?: number;
  temperature?: number;
  performanceScore?: number;
}

export interface WearableSession {
  id: string;
  eventId: string;
  startedAt: string;
  endedAt?: string;
  pollingIntervalSeconds: number;
  readings: WearableReading[];
  status: 'active' | 'paused' | 'completed';
}

export interface AggregatedMetrics {
  participantsCount: number;
  heartRateAvg: number;
  caloriesTotal: number;
  distanceTotal: number;
  durationMinutes: number;
}
