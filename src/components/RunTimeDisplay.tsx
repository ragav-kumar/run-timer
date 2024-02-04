import styles from './RunTimeDisplay.module.scss';
import { toTimeString } from './utilities.ts';

interface RunTimeDisplayProps {
    elapsedTime: number;
    totalTime: number;
}

export const RunTimeDisplay = ( { elapsedTime, totalTime }: RunTimeDisplayProps ) => (
    <div className={styles.wrap}>
        <div className={styles.boldTime}>
            -{toTimeString(Math.abs(totalTime - elapsedTime))}
        </div>
        <div>
            <span className={styles.boldTime}>
                {toTimeString(elapsedTime)}
            </span>
            /
            <span className={styles.lightTime}>
                {toTimeString(totalTime)}
            </span>
        </div>
    </div>
);