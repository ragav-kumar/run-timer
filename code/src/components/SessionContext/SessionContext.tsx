import { createContext } from 'react';
import { SessionConfiguration } from '../../session.ts';

interface SessionContextType {
    session: SessionConfiguration;
    update: (session: SessionConfiguration) => void;
}

export const SessionContext = createContext<SessionContextType | undefined>(undefined);
SessionContext.displayName = 'SessionContext';