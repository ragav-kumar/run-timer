import { useFormContext } from './useFormContext.ts';
import { ReactNode } from 'react';

interface FormButtonProps {
    variant: 'submit' | 'reset';
    children: ReactNode;
}

export const Button = ( { children, variant }: FormButtonProps ) => {
    const { onSubmit, onReset } = useFormContext();

    return (
        <button
            onClick={variant === 'submit' ? onSubmit : onReset}
        >
            {children}
        </button>
    );
};