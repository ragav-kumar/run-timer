import styles from './TabBar.module.scss';

export type Page = 'config' | 'run';

interface TabBarProps {
    page: Page;
    setPage: ( page: Page ) => void;
}

export const TabBar = ( { page, setPage }: TabBarProps ) => (
    <div className={styles.wrap}>
        <button
            onClick={() => setPage('config')}
            disabled={page === 'config'}
        >
            Configure
        </button>
        <button
            onClick={() => setPage('run')}
            disabled={page === 'run'}
        >
            Run
        </button>
    </div>
);