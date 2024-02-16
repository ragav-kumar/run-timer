import React from 'react';
import { SessionConfiguration } from './session.ts';
import { Form, NumberField } from './components';
import { Button } from './components/Button.tsx';
import styles from './ConfigurationView.module.scss';
import { useSessionContext } from './components/SessionContext';

export const ConfigurationView = () => {
    const { session, updateSession } = useSessionContext();

    return (
        <Form data={session} onSubmit={updateSession} className={styles.form}>
            <NumberField<SessionConfiguration> field='warmUp'>
                Warm up
            </NumberField>
            <NumberField<SessionConfiguration> field='coolDown'>
                Cool down
            </NumberField>
            <NumberField<SessionConfiguration> field='runPeriod'>
                Run period
            </NumberField>
            <NumberField<SessionConfiguration> field='walkPeriod'>
                Walk period
            </NumberField>
            <NumberField<SessionConfiguration> field='cycles'>
                # of Cycles
            </NumberField>
            <div />
            <Button variant='submit'>
                Save
            </Button>
            <Button variant='reset'>
                Reset
            </Button>
        </Form>
    );
};