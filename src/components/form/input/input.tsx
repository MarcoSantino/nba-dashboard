import React, { ChangeEvent } from 'react';
import { InputComponent } from '../../../interfaces/components/input-component';
import './input.scss';

function Input({ onChange, id, label, placeholder, value }: InputComponent): JSX.Element {
    return (
        <div className="input--wrapper">
            <label className="input--label" htmlFor={id}>{label}</label>
            <input autoComplete={'off'} className="input" type="text" id={id} placeholder={placeholder} value={value}
                onChange={(event: ChangeEvent<HTMLInputElement>) => onChange(event)} />
        </div>
    );
}

export default Input