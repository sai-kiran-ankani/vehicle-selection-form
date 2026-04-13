import { VehicleForm } from './components/VehicleForm/VehicleForm';
import styles from './App.module.css';

export default function App() {
  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <span className={styles.brand}>AutoGrab</span>
          <h1 className={styles.title}>Vehicle Selection Form</h1>
        </div>
      </header>
      <main className={styles.main}>
        <div className={styles.card}>
          <VehicleForm />
        </div>
      </main>
    </div>
  );
}
