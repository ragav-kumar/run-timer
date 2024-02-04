export interface SessionConfiguration {
    /** Duration before cycles begin, in seconds */
    warmUp: number;
    /** Duration after last cycle ends, in seconds. This will replace the final walk period. */
    coolDown: number;
    /** Run duration, in seconds */
    runPeriod: number;
    /** Walk duration, in seconds */
    walkPeriod: number;
    /** Number of run/walk cycles */
    cycles: number;
}

const localStorageKey = 'session_config' as const;

export const initSession = (): SessionConfiguration => {
    const sessionJson: string | null = localStorage.getItem(localStorageKey);
    let session: SessionConfiguration | null | undefined;
    if (sessionJson != null) {
        session = JSON.parse(sessionJson) as SessionConfiguration | null | undefined;
    }

    return session || {
        coolDown: 300,
        warmUp: 300,
        runPeriod: 60,
        walkPeriod: 300,
        cycles: 5,
    };
};

export const saveSession = (session: SessionConfiguration) => {
    localStorage.setItem(localStorageKey, JSON.stringify(session));
};