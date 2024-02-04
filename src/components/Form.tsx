import { ReactNode, useState } from 'react';
import { ChangeEventHandler, FormContext } from './FormContext.tsx';

interface FormProps<T> {
    data: T;
    onSubmit: ( data: T ) => void;
    children: ReactNode;
    className?: string;
}

export const Form = <T extends object>( { data, onSubmit, children, className }: FormProps<T> ) => {
    const [ formData, setFormData ] = useState<T>(data);

    const change: ChangeEventHandler<T> = ( field, value ) => {
        setFormData(d => ( {
            ...d,
            [field]: value,
        } ));
    };

    return (
        <FormContext.Provider
            value={{
                data: formData,
                originalData: data,
                onChange: change,
                onSubmit: () => onSubmit(formData),
                onReset: () => setFormData(data),
            }}
        >
            <form onSubmit={e => e.preventDefault()} className={className}>
                {children}
            </form>
        </FormContext.Provider>
    );
};