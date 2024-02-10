import styles from './RunTimeDisplay.module.scss';
import { toTimeString } from './utilities.ts';
import { useSessionContext } from './SessionContext';

export const RunTimeDisplay = () => {
    const { currentRun: { elapsedTime, totalTime } } = useSessionContext();
    return (
        <div className={styles.wrap}>
            <div className={styles.boldTime}>
                -{toTimeString(Math.abs(totalTime - elapsedTime) / 1000)}
            </div>
            <div>
                <span className={styles.boldTime}>
                    {toTimeString(elapsedTime / 1000)}
                </span>
                /
                <span className={styles.lightTime}>
                    {toTimeString(totalTime / 1000)}
                </span>
            </div>
        </div>
    );
};