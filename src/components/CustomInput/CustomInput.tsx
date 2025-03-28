// src/components/CustomInput/CustomInput.tsx
import { FormGroup, Input, Label } from "reactstrap";
import { InputType } from "reactstrap/types/lib/Input";
import { Dispatch, SetStateAction } from "react";

interface CustomInputProps {
    label: string;
    placeholder?: string;
    value: string;
    setValue: Dispatch<SetStateAction<string>>;
    disabled?: boolean;
    required?: boolean;
    error?: boolean;
    valid?: boolean;
    type?: InputType;
}

const CustomInput: React.FC<CustomInputProps> = ({
    label,
    placeholder = "",
    value,
    setValue,
    disabled = false,
    required = true,
    error = false,
    valid = false,
    type = "text",
}) => {
    return (
        <FormGroup>
            <Label>{label}</Label>
            <Input
                placeholder={placeholder}
                className="w-100"
                type={type}
                value={value}
                onChange={(e) => setValue(e.target.value)}
                invalid={error && !valid}
                disabled={disabled}
                required={required}
                valid={!error && valid}
            />
        </FormGroup>
    );
};

export default CustomInput;
