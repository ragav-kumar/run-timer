import { ReactNode, useEffect, useState } from 'react';
import { CurrentRun, initSession, saveSession, SessionConfiguration } from '../../session.ts';
import { SessionContext } from './SessionContext.tsx';
import { SegmentType } from '../utilities.ts';

const initRun = (totalTime: number = 0): CurrentRun => ( {
    elapsedTime: 0,
    totalTime,
    startTime: new Date().getTime(),
    isRunning: false,
    currentSegment: {
        position: 'warmUp',
        type: 'bookEnd',
        startTime: new Date().getTime(),
        duration: 0,
    },
} );

export const SessionContextProvider = ( { children }: { children: ReactNode } ) => {
    const [ session, setSession ] = useState<SessionConfiguration>(initSession);
    const [ run, setRun ] = useState<CurrentRun>(initRun);

    const updateSession = ( newSession: SessionConfiguration ) => {
        setSession(newSession);
        saveSession(newSession);
    };

    const updateRun = ( runPartial?: Partial<CurrentRun> ) => setRun(run => {
        const updatedRun: CurrentRun = {
            ...run,
            ...runPartial,
            elapsedTime: 0,
        };
        const isRunning = runPartial?.isRunning || ( runPartial?.isRunning == null && run.isRunning );
        if ( isRunning ) {
            updatedRun.elapsedTime = new Date().getTime() - run.startTime;
            if ( updatedRun.elapsedTime > updatedRun.totalTime ) {
                updatedRun.isRunning = false;
            }
        }
        const currentSegment = getCurrentSegment(updatedRun.elapsedTime);
        updatedRun.currentSegment = {
            position: currentSegment,
            startTime: currentSegment !== run.currentSegment.position ? new Date().getTime() : run.currentSegment.startTime,
            duration: getSegmentDuration(currentSegment),
            type: getSegmentType(currentSegment),
        };
        return updatedRun;
    });

    const getSegmentDuration = (currentSegment: number | 'warmUp' | 'coolDown'): number => {
        switch (currentSegment ) {
            case 'warmUp':
                return session.warmUp * 1000;
            case 'coolDown':
                return session.coolDown * 1000;
            default:
                return (currentSegment % 2 === 1 ? session.walkPeriod : session.runPeriod) * 1000;
        }
    };

    const getSegmentType = (currentSegment: number | 'warmUp' | 'coolDown'): SegmentType => {
        switch (currentSegment ) {
            case 'warmUp':
            case 'coolDown':
                return 'bookEnd';
            default:
                return currentSegment % 2 === 1 ? 'walk' : 'run';
        }
    };

    const getCurrentSegment = (elapsedTime: number): number | 'warmUp' | 'coolDown' => {
        const { warmUp, runPeriod, walkPeriod, coolDown } = session;
        const { totalTime } = run;
        if ( elapsedTime / 1000 < warmUp ) {
            return 'warmUp';
        }
        if ( elapsedTime / 1000 >= totalTime / 1000 - coolDown ) {
            return 'coolDown';
        }
        const cycleTime = runPeriod + walkPeriod;
        const currentCycle = Math.floor(Math.floor(elapsedTime / 1000 - warmUp) / cycleTime);

        const cycleRunStartTime = warmUp + currentCycle * cycleTime;
        const cycleWalkStartTime = cycleRunStartTime + runPeriod;
        return 2 * currentCycle + ( elapsedTime / 1000 > cycleWalkStartTime ? 1 : 0 );
    };

    useEffect(() => {
        setRun(r => ( { ...r, totalTime: computeTotalTime(session) } ));
    }, [ session ]);

    return (
        <SessionContext.Provider
            value={{
                session,
                updateSession,
                currentRun: run,
                updateRun,
                resetRun: isRunning => setRun({ ...initRun(run.totalTime), isRunning }),
            }}
        >
            {children}
        </SessionContext.Provider>
    );
};

const computeTotalTime = ( { warmUp, cycles, runPeriod, walkPeriod, coolDown }: SessionConfiguration ): number => (
    warmUp +
    coolDown +
    ( cycles * runPeriod ) +
    ( Math.max(cycles - 1) * walkPeriod )
) * 1000;