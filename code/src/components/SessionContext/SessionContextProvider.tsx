import { ReactNode, useState } from 'react';
import { initSession, saveSession, SessionConfiguration } from '../../session.ts';
import { SessionContext } from './SessionContext.tsx';

export const SessionContextProvider = ({ children }: { children: ReactNode }) => {
    const [ session, setSession ] = useState<SessionConfiguration>(initSession);

    const update = (newSession: SessionConfiguration) => {
        setSession(newSession);
        saveSession(newSession);
    };

    return (
        <SessionContext.Provider value={{
            session,
            update,
        }}>
            {children}
        </SessionContext.Provider>
    );
};