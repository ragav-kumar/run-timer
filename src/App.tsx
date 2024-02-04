import React, { useState } from 'react';
import styles from './App.module.scss';
import { ConfigurationView } from './ConfigurationView.tsx';
import { RunView } from './RunView.tsx';
import { Page, TabBar } from './components/TabBar.tsx';
import { SessionContextProvider } from './components/SessionContext';

const App = () => {
    const [ page, setPage ] = useState<Page>('run');

    return (
        <SessionContextProvider>
            <div className={styles.wrap}>
                <TabBar page={page} setPage={setPage} />
                {page === 'config' ? (
                    <ConfigurationView />
                ) : page === 'run' ? (
                    <RunView />
                ) : null}
                <div />
            </div>
        </SessionContextProvider>
    );
};

export default App;
