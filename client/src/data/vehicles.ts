import type { QuickPreset } from '../types';

export type VehicleMap = Record<string, Record<string, string[]>>;

export const VEHICLES: VehicleMap = {
  ford: {
    Ranger: ['Raptor', 'Raptor X', 'Wildtrak'],
    Falcon: ['XR6', 'XR6 Turbo', 'XR8'],
    'Falcon Ute': ['XR6', 'XR6 Turbo'],
  },
  bmw: {
    '130d': ['xDrive 26d', 'xDrive 30d'],
    '240i': ['xDrive 30d', 'xDrive 50d'],
    '320e': ['xDrive 75d', 'xDrive 80d', 'xDrive 85d'],
  },
  tesla: {
    'Model 3': ['Performance', 'Long Range', 'Dual Motor'],
  },
};

export const MAKE_LABELS: Record<string, string> = {
  ford: 'Ford',
  bmw: 'BMW',
  tesla: 'Tesla',
};

export const MAKES = Object.keys(VEHICLES);

export const QUICK_PRESETS: QuickPreset[] = [
  { label: 'Tesla Model 3 Performance', make: 'tesla', model: 'Model 3', badge: 'Performance' },
  { label: 'Ford Ranger Raptor', make: 'ford', model: 'Ranger', badge: 'Raptor' },
];

export function getModels(make: string): string[] {
  return make ? Object.keys(VEHICLES[make] ?? {}) : [];
}

export function getBadges(make: string, model: string): string[] {
  return make && model ? (VEHICLES[make]?.[model] ?? []) : [];
}
