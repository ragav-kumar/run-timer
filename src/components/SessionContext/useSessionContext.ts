import { useContext } from 'react';
import { SessionContext } from './SessionContext';

export const useSessionContext = () => {
    const context = useContext(SessionContext);
    if (context == null) {
        throw new Error('SessionContext not initialized.');
    }

    return context;
}