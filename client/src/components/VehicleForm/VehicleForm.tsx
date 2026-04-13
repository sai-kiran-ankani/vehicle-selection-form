import { useState } from 'react';
import { MAKES, MAKE_LABELS } from '../../data/vehicles';
import { useVehicleForm } from '../../hooks/useVehicleForm';
import { QuickSelect } from '../QuickSelect/QuickSelect';
import { SubmissionResult } from '../SubmissionResult/SubmissionResult';
import type { SubmissionResponse } from '../../types';
import styles from './VehicleForm.module.css';

export function VehicleForm() {
  const {
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
  } = useVehicleForm();

  const [result, setResult] = useState<SubmissionResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!form.logbook) return;

    setIsSubmitting(true);
    setError(null);

    const data = new FormData();
    data.append('make', form.make);
    data.append('model', form.model);
    data.append('badge', form.badge);
    data.append('logbook', form.logbook);

    try {
      const res = await fetch('/api/vehicle', { method: 'POST', body: data });
      const json = await res.json();
      if (!res.ok) throw new Error((json as { error: string }).error ?? 'Submission failed');
      setResult(json as SubmissionResponse);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleReset() {
    setResult(null);
    setError(null);
    reset();
  }

  if (result) {
    return <SubmissionResult result={result} onReset={handleReset} />;
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit} noValidate>
      <QuickSelect onSelect={applyPreset} />

      <fieldset className={styles.fieldset}>
        <legend className={styles.legend}>Vehicle Details</legend>

        <div className={styles.field}>
          <label htmlFor="make" className={styles.label}>
            Make
          </label>
          <select
            id="make"
            value={form.make}
            onChange={(e) => setMake(e.target.value)}
            className={styles.select}
          >
            <option value="">Select a make</option>
            {MAKES.map((make) => (
              <option key={make} value={make}>
                {MAKE_LABELS[make] ?? make}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.field}>
          <label htmlFor="model" className={styles.label}>
            Model
          </label>
          <select
            id="model"
            value={form.model}
            onChange={(e) => setModel(e.target.value)}
            disabled={models.length === 0}
            className={styles.select}
          >
            <option value="">Select a model</option>
            {models.map((model) => (
              <option key={model} value={model}>
                {model}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.field}>
          <label htmlFor="badge" className={styles.label}>
            Badge
          </label>
          <select
            id="badge"
            value={form.badge}
            onChange={(e) => setBadge(e.target.value)}
            disabled={badges.length === 0}
            className={styles.select}
          >
            <option value="">Select a badge</option>
            {badges.map((badge) => (
              <option key={badge} value={badge}>
                {badge}
              </option>
            ))}
          </select>
        </div>

        {form.badge && (
          <div className={styles.field}>
            <label htmlFor="logbook" className={styles.label}>
              Service Logbook
            </label>
            <p className={styles.hint}>Upload your service logbook as a plain text (.txt) file</p>
            <input
              id="logbook"
              type="file"
              accept=".txt,text/plain"
              onChange={(e) => setLogbook(e.target.files?.[0] ?? null)}
              className={styles.fileInput}
            />
          </div>
        )}
      </fieldset>

      {error && (
        <p role="alert" className={styles.errorMessage}>
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={!isReadyToSubmit || isSubmitting}
        aria-busy={isSubmitting}
        className={styles.submitButton}
      >
        {isSubmitting ? 'Submitting…' : 'Submit'}
      </button>
    </form>
  );
}
