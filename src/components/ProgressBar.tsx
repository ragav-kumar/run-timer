import { useSessionContext } from './SessionContext';
import { useCallback, useEffect, useMemo, useState } from 'react';
import styles from './ProgressBar.module.scss';
import { ProgressBarSegment } from './ProgressBarSegment.tsx';
import { SegmentType } from './utilities.ts';

interface Segment {
    segmentType: SegmentType;
    width: number;
}

interface ProgressBarProps {
    onTransition: () => void;
}

export const ProgressBar = ( { onTransition }: ProgressBarProps ) => {
    const [ progressBarWidth, setProgressBarWidth ] = useState<number>(document.body.offsetWidth * .8);
    const { session, currentRun } = useSessionContext();
    const { warmUp, cycles, runPeriod, walkPeriod, coolDown } = session;
    const { elapsedTime, totalTime } = currentRun;

    const segmentWidth = useCallback(( segmentTime: number ): number => {
        return ( segmentTime / totalTime ) * progressBarWidth;
    }, [ progressBarWidth, totalTime ]);

    const segmentDefs = useMemo(() => {
        if ( cycles <= 0 || ( runPeriod <= 0 && walkPeriod <= 0 ) ) {
            return [];
        }
        const segments: Segment[] = [];

        if ( runPeriod <= 0 || walkPeriod <= 0 ) { // Single period type
            const period = runPeriod <= 0 ? walkPeriod : runPeriod;
            const periodType = runPeriod <= 0 ? 'walk' : 'run';
            for ( let i = 0; i < cycles; i++ ) {
                segments.push({ segmentType: periodType, width: segmentWidth(period * 1000) });
            }
        } else {
            for ( let i = 0; i < cycles; i++ ) {
                segments.push({ segmentType: 'run', width: segmentWidth(runPeriod * 1000) });
                if ( i < ( cycles - 1 ) ) {
                    segments.push({ segmentType: 'walk', width: segmentWidth(walkPeriod * 1000) });
                }
            }
        }

        return segments;
    }, [ cycles, runPeriod, segmentWidth, walkPeriod ]);

    const percentProgress = 100 * Math.min(elapsedTime, totalTime) / totalTime;

    useEffect(() => {
        if ( percentProgress > 0 ) {
            onTransition();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ currentRun.currentSegment.position ]);

    useEffect(() => {
        if ( percentProgress >= 100 ) {
            onTransition();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ percentProgress ]);

    useEffect(() => {
        const resize = () => {
            setProgressBarWidth(document.body.offsetWidth * .8);
        };

        window.addEventListener('resize', resize);

        return () => {
            window.removeEventListener('resize', resize);
        };
    }, []);

    return (
        <div className={styles.wrap}>
            {warmUp > 0 ? (
                <ProgressBarSegment
                    segmentType='bookEnd'
                    width={segmentWidth(warmUp * 1000)}
                    isActiveSegment={currentRun.currentSegment.position === 'warmUp'}
                />
            ) : null}
            {segmentDefs.map(( { segmentType, width }, index ) => (
                <ProgressBarSegment
                    key={index}
                    segmentType={segmentType}
                    width={width}
                    isActiveSegment={currentRun.currentSegment.position === index}
                />
            ))}
            {coolDown > 0 ? (
                <ProgressBarSegment
                    segmentType='bookEnd'
                    width={segmentWidth(coolDown * 1000)}
                    isActiveSegment={currentRun.currentSegment.position === 'coolDown'}
                />
            ) : null}
            <div className={styles.marker} style={{ left: `${percentProgress}%` }}>
                <div className={styles.markerLine} />
                <div className={styles.markerTriangle} />
            </div>
        </div>
    );
};