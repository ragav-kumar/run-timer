import { useContext } from 'react';
import { FormContext, FormContextType } from './FormContext.tsx';

export const useFormContext = <T extends object>(): FormContextType<T> => {
    const context: FormContextType<T> | undefined = useContext(FormContext);
    if (context == null) {
        throw new Error('Attempted to invoke FormContext prior to initializing');
    }
    return context;
};