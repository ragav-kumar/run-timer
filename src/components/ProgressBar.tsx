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
    currentTime: number;
    totalTime: number;
    onTransition: () => void;
}

export const ProgressBar = ( { currentTime, totalTime, onTransition }: ProgressBarProps ) => {
    const [ progressBarWidth, setProgressBarWidth ] = useState<number>(document.body.offsetWidth * .8);
    const { session } = useSessionContext();
    const { warmUp, cycles, runPeriod, walkPeriod, coolDown } = session;

    const getCurrentSegment = (): number | 'warmUp' | 'coolDown' => {
        if ( currentTime < warmUp ) {
            return 'warmUp';
        }
        if ( currentTime >= totalTime - coolDown ) {
            return 'coolDown';
        }
        const cycleTime = runPeriod + walkPeriod;
        const currentCycle = Math.floor(Math.floor(currentTime - warmUp) / cycleTime);

        const cycleRunStartTime = warmUp + currentCycle * cycleTime;
        const cycleWalkStartTime = cycleRunStartTime + runPeriod;
        return 2 * currentCycle + ( currentTime > cycleWalkStartTime ? 1 : 0 );
    };

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
                segments.push({ segmentType: periodType, width: segmentWidth(period) });
            }
        } else {
            for ( let i = 0; i < cycles; i++ ) {
                segments.push({ segmentType: 'run', width: segmentWidth(runPeriod) });
                if ( i < ( cycles - 1 ) ) {
                    segments.push({ segmentType: 'walk', width: segmentWidth(walkPeriod) });
                }
            }
        }

        return segments;
    }, [ cycles, runPeriod, segmentWidth, walkPeriod ]);

    const percentProgress = 100 * Math.min(currentTime, totalTime) / totalTime;
    const currentSegment = getCurrentSegment();

    useEffect(() => {
        if ( percentProgress > 0 ) {
            onTransition();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ currentSegment ]);

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
                    width={segmentWidth(warmUp)}
                    isActiveSegment={currentSegment === 'warmUp'}
                />
            ) : null}
            {segmentDefs.map(( { segmentType, width }, index ) => (
                <ProgressBarSegment
                    key={index}
                    segmentType={segmentType}
                    width={width}
                    isActiveSegment={currentSegment === index}
                />
            ))}
            {coolDown > 0 ? (
                <ProgressBarSegment
                    segmentType='bookEnd'
                    width={segmentWidth(coolDown)}
                    isActiveSegment={currentSegment === 'coolDown'}
                />
            ) : null}
            <div className={styles.marker} style={{ left: `${percentProgress}%` }}>
                <div className={styles.markerLine} />
                <div className={styles.markerTriangle} />
            </div>
        </div>
    );
};