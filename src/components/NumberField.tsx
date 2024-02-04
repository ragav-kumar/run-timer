import { useFormContext } from './useFormContext.ts';
import styles from './Form.module.scss';
import { ReactNode } from 'react';

interface NumberFieldProps<T extends object> {
    field: keyof T;
    children: ReactNode;
}

export const NumberField = <T extends object>( { field, children }: NumberFieldProps<T> ) => {
    const { data, onChange } = useFormContext<T>();

    return (
        <label className={styles.inputGroup}>
            <div>{children}</div>
            <input
                className={styles.numberField}
                type='tel'
                value={data[field] as number}
                onChange={e => onChange(field, parseInt(e.target.value) as T[keyof T])}
            />
        </label>
    );
};