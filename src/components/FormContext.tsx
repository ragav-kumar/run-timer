import React from 'react';

export type ChangeEventHandler<T> = (field: keyof T, value: T[keyof T]) => void;

export interface FormContextType<T extends object> {
    data: T;
    originalData: T;
    onChange: ChangeEventHandler<T>;
    onSubmit: () => void;
    onReset: () => void;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const FormContext = React.createContext<FormContextType<any> | undefined>(undefined);
FormContext.displayName = 'FormContext';