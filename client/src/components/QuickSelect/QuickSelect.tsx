import type { QuickPreset } from '../../types';
import { QUICK_PRESETS } from '../../data/vehicles';
import styles from './QuickSelect.module.css';

interface Props {
  onSelect: (preset: QuickPreset) => void;
}

export function QuickSelect({ onSelect }: Props) {
  return (
    <div className={styles.container}>
      <p className={styles.heading}>Quick select a common vehicle:</p>
      <div className={styles.buttons}>
        {QUICK_PRESETS.map((preset) => (
          <button
            key={preset.label}
            type="button"
            onClick={() => onSelect(preset)}
            className={styles.button}
          >
            {preset.label}
          </button>
        ))}
      </div>
    </div>
  );
}
