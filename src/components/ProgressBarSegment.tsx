import styles from './ProgressBar.module.scss';
import { segmentColours, SegmentType } from './utilities';

interface ProgressBarSegmentProps {
    segmentType: SegmentType;
    width: number;
    isActiveSegment: boolean;
}

export const ProgressBarSegment = ( { segmentType, width, isActiveSegment }: ProgressBarSegmentProps ) => (
    <div
        className={isActiveSegment ? styles.activeSegment : styles.segment}
        style={{
            width,
            backgroundColor: segmentColours[segmentType],
        }}
    />
);