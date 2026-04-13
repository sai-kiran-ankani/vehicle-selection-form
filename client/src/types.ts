export interface VehicleSelection {
  make: string;
  model: string;
  badge: string;
}

export interface QuickPreset extends VehicleSelection {
  label: string;
}

export interface SubmissionResponse {
  make: string;
  model: string;
  badge: string;
  logbookContents: string;
}

export interface ApiError {
  error: string;
}
