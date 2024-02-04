import styles from './ProgressBar.module.scss';

export type SegmentType = 'bookEnd' | 'run' | 'walk'

interface ProgressBarSegmentProps {
    segmentType: SegmentType;
    width: number;
    isActiveSegment: boolean;
}

export const ProgressBarSegment = ( { segmentType, width, isActiveSegment }: ProgressBarSegmentProps ) => (
    <div
        className={styles[segmentType] + (isActiveSegment ? ` ${styles.active}` : '')}
        style={{ width }}
    />
);