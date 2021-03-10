import { ChangeEvent } from "react";

export interface InputComponent {
    onChange: (event: ChangeEvent<HTMLInputElement>) => void;
    id: string;
    label: string;
    placeholder: string;
    value: string;
}