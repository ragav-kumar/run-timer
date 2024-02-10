import { createContext } from 'react';
import { CurrentRun, SessionConfiguration } from '../../session.ts';

interface SessionContextType {
    session: SessionConfiguration;
    currentRun: CurrentRun;
    updateSession: ( session: SessionConfiguration ) => void;
    updateRun: ( run?: Partial<CurrentRun> ) => void;
    resetRun: ( isRunning: boolean ) => void;
}

export const SessionContext = createContext<SessionContextType | undefined>(undefined);
SessionContext.displayName = 'SessionContext';