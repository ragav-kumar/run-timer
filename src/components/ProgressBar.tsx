import { useSessionContext } from './SessionContext';
import { SessionConfiguration } from '../session.ts';
import { useEffect, useMemo } from 'react';
import styles from './ProgressBar.module.scss';
import { ProgressBarSegment, SegmentType } from './ProgressBarSegment.tsx';

const progressBarWidth = 1000 as const;

interface ProgressBarProps {
    currentTime: number;
    totalTime: number;
    onTransition: () => void;
}

export const ProgressBar = ( { currentTime, totalTime, onTransition }: ProgressBarProps ) => {
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
        const currentCycle = Math.floor(Math.floor( currentTime - warmUp ) / cycleTime);
        console.log({ currentTime, warmUp, cycleTime, currentCycle });
        const cycleRunStartTime = warmUp + currentCycle * cycleTime;
        const cycleWalkStartTime = cycleRunStartTime + runPeriod;
        return 2 * currentCycle + ( currentTime > cycleWalkStartTime ? 1 : 0 );
    };

    const segmentWidth = ( segmentTime: number ): number => ( segmentTime / totalTime ) * progressBarWidth;

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
    }, [ cycles, runPeriod, totalTime, walkPeriod ]);

    const percentProgress = 100 * Math.min(currentTime, totalTime) / totalTime;
    const currentSegment = getCurrentSegment();

    useEffect(() => {
        onTransition();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ currentSegment ]);

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

const countActiveSegments = ( { cycles, runPeriod, walkPeriod }: SessionConfiguration ): number => {
    let segments: number = 0;

    if ( runPeriod > 0 ) {
        segments += cycles;
    }
    if ( walkPeriod > 0 ) {
        segments += cycles;
    }

    return segments;
};

interface Segment {
    segmentType: SegmentType;
    width: number;
}