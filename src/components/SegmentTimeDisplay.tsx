import { segmentColours, segmentTextColours, toTimeString } from './utilities';
import styles from './SegmentTimeDisplay.module.scss';
import { useSessionContext } from './SessionContext';

export const SegmentTimeDisplay = () => {
    const { currentRun } = useSessionContext();

    const sessionTime = new Date().getTime() - currentRun.currentSegment.startTime;
    const timeLeft = currentRun.currentSegment.duration - sessionTime;

    return currentRun.isRunning ? (
        <div className={styles.wrap}>
            <div
                style={{
                    backgroundColor: segmentColours[currentRun.currentSegment.type],
                    color: segmentTextColours[currentRun.currentSegment.type],
                }}
            >
                {toTimeString(timeLeft / 1000)}
            </div>
        </div>
    ) : null;
};