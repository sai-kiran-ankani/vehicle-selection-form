import type { SubmissionResponse } from '../../types';
import { MAKE_LABELS } from '../../data/vehicles';
import styles from './SubmissionResult.module.css';

interface Props {
  result: SubmissionResponse;
  onReset: () => void;
}

export function SubmissionResult({ result, onReset }: Props) {
  return (
    <div className={styles.container}>
      <div className={styles.successBanner}>
        <span className={styles.checkIcon} aria-hidden="true">✓</span>
        <h2 className={styles.successTitle}>Submission Successful</h2>
      </div>

      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>Vehicle Selected</h3>
        <dl className={styles.detail}>
          <div className={styles.row}>
            <dt className={styles.term}>Make</dt>
            <dd className={styles.value}>{MAKE_LABELS[result.make] ?? result.make}</dd>
          </div>
          <div className={styles.row}>
            <dt className={styles.term}>Model</dt>
            <dd className={styles.value}>{result.model}</dd>
          </div>
          <div className={styles.row}>
            <dt className={styles.term}>Badge</dt>
            <dd className={styles.value}>{result.badge}</dd>
          </div>
        </dl>
      </section>

      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>Logbook Contents</h3>
        <pre className={styles.logbook}>{result.logbookContents}</pre>
      </section>

      <button type="button" onClick={onReset} className={styles.resetButton}>
        Start Over
      </button>
    </div>
  );
}
