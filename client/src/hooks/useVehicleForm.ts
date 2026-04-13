import { useState } from 'react';
import { getModels, getBadges } from '../data/vehicles';
import type { VehicleSelection } from '../types';

interface FormState {
  make: string;
  model: string;
  badge: string;
  logbook: File | null;
}

export interface UseVehicleFormReturn {
  form: FormState;
  models: string[];
  badges: string[];
  setMake: (make: string) => void;
  setModel: (model: string) => void;
  setBadge: (badge: string) => void;
  setLogbook: (file: File | null) => void;
  applyPreset: (preset: VehicleSelection) => void;
  reset: () => void;
  isReadyToSubmit: boolean;
}

const EMPTY_FORM: FormState = { make: '', model: '', badge: '', logbook: null };

export function useVehicleForm(): UseVehicleFormReturn {
  const [form, setForm] = useState<FormState>(EMPTY_FORM);

  const models = getModels(form.make);
  const badges = getBadges(form.make, form.model);

  function setMake(make: string) {
    setForm({ make, model: '', badge: '', logbook: null });
  }

  function setModel(model: string) {
    setForm((prev) => ({ ...prev, model, badge: '', logbook: null }));
  }

  function setBadge(badge: string) {
    setForm((prev) => ({ ...prev, badge, logbook: null }));
  }

  function setLogbook(logbook: File | null) {
    setForm((prev) => ({ ...prev, logbook }));
  }

  function applyPreset(preset: VehicleSelection) {
    setForm({ make: preset.make, model: preset.model, badge: preset.badge, logbook: null });
  }

  function reset() {
    setForm(EMPTY_FORM);
  }

  const isReadyToSubmit = Boolean(form.make && form.model && form.badge && form.logbook);

  return {
    form,
    models,
    badges,
    setMake,
    setModel,
    setBadge,
    setLogbook,
    applyPreset,
    reset,
    isReadyToSubmit,
  };
}
