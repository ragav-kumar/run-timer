import { useSessionContext } from './components/SessionContext';
import { useEffect, useMemo, useRef, useState } from 'react';
import { SessionConfiguration } from './session.ts';
import { ProgressBar } from './components/ProgressBar.tsx';
import styles from './RunView.module.scss';
import whistle from './assets/whistle2.mp3';
import { RunTimeDisplay } from './components/RunTimeDisplay.tsx';
import { SegmentTimeDisplay } from './components/SegmentTimeDisplay.tsx';

export const RunView = () => {
    const [ startTime, setStartTime ] = useState<Date>(new Date());
    const [ elapsedTime, setElapsedTime ] = useState<number>(0);
    const [ isRunning, setIsRunning ] = useState<boolean>(false);
    const timeoutRef = useRef<number | null>(null);

    const { session } = useSessionContext();
    const totalTime = useMemo(() => computeTotalTime(session), [ session ]);
    const audioRef = useRef(new Audio(whistle));

    const playSfx = () => {
        if ( (!isRunning && elapsedTime / 1000 < totalTime) || !audioRef.current ) {
            return;
        }
        audioRef.current.play().catch(console.error);
    };

    const tick = () => {
        const now = new Date();
        const elapsed = now.getTime() - startTime.getTime();
        setElapsedTime(elapsed);

        if ( ( elapsed / 1000 ) >= totalTime ) {
            setIsRunning(false);
            // Exit condition
            if ( timeoutRef.current != null ) {
                clearInterval(timeoutRef.current);
            }
        }
    };

    const toggleTimer = () => {
        if ( timeoutRef.current != null ) {
            clearInterval(timeoutRef.current);
        }

        if ( isRunning ) { // Stop
            setIsRunning(false);
        } else { // Start
            setStartTime(new Date());
            setIsRunning(true);
            setElapsedTime(0);
        }
    };

    useEffect(() => {
        if ( isRunning ) {
            timeoutRef.current = setInterval(tick, 100);
        }
        return () => {
            if ( timeoutRef.current != null ) {
                clearInterval(timeoutRef.current);
            }
        };
    }, [ isRunning ]);

    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.volume = 1.0;
        }
    }, []);

    return (
        <div className={styles.wrap}>
            <SegmentTimeDisplay time={elapsedTime / 1000} segmentType='run' />
            <RunTimeDisplay elapsedTime={elapsedTime / 1000} totalTime={totalTime}/>
            <ProgressBar
                currentTime={elapsedTime / 1000}
                totalTime={totalTime}
                onTransition={playSfx}
            />
            <button onClick={toggleTimer}>
                {isRunning ? 'Stop' : 'Start'}
            </button>
        </div>
    );
};

const computeTotalTime = ( { warmUp, cycles, runPeriod, walkPeriod, coolDown }: SessionConfiguration ): number => (
    warmUp +
    coolDown +
    ( cycles * runPeriod ) +
    ( Math.max(cycles - 1) * walkPeriod )
);
