import { segmentColours, SegmentType, toTimeString } from './utilities';
import styles from './SegmentTimeDisplay.module.scss';

interface SegmentTimeDisplayProps {
    time: number;
    segmentType: SegmentType;
}

export const SegmentTimeDisplay = ( { segmentType, time }: SegmentTimeDisplayProps ) => (
    <div className={styles.wrap}>
        <div style={{ backgroundColor: segmentColours[segmentType] }}>
            {toTimeString(time)}
        </div>
    </div>
);