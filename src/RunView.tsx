import { useSessionContext } from './components/SessionContext';
import { useEffect, useRef } from 'react';
import { ProgressBar } from './components/ProgressBar.tsx';
import styles from './RunView.module.scss';
import whistle from './assets/whistle2.mp3';
import { RunTimeDisplay } from './components/RunTimeDisplay.tsx';
import { SegmentTimeDisplay } from './components/SegmentTimeDisplay.tsx';

export const RunView = () => {
    const timeoutRef = useRef<number | null>(null);

    const { currentRun, updateRun, resetRun } = useSessionContext();
    const audioRef = useRef(new Audio(whistle));

    const playSfx = () => {
        if ( (!currentRun.isRunning && currentRun.elapsedTime < currentRun.totalTime) || !audioRef.current ) {
            return;
        }
        audioRef.current.play().catch(console.error);
    };

    const toggleTimer = () => {
        if ( timeoutRef.current != null ) {
            clearInterval(timeoutRef.current);
        }

        if (currentRun.isRunning) { // Stop
            updateRun({ isRunning: false });
        } else { // Start
            resetRun(true);
        }
    };

    useEffect(() => {
        if ( currentRun.isRunning ) {
            timeoutRef.current = setInterval(updateRun, 100);
        } else {
            // Exit condition
            if ( timeoutRef.current != null ) {
                clearInterval(timeoutRef.current);
            }
        }
        return () => {
            if ( timeoutRef.current != null ) {
                clearInterval(timeoutRef.current);
            }
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ currentRun.isRunning ]);

    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.volume = 1.0;
        }
    }, []);

    return (
        <div className={styles.wrap}>
            <SegmentTimeDisplay />
            <RunTimeDisplay/>
            <ProgressBar onTransition={playSfx} />
            <button onClick={toggleTimer}>
                {currentRun.isRunning ? 'Stop' : 'Start'}
            </button>
        </div>
    );
};