export interface Validatable {
    value: string | number;
    required?: boolean;
    minLength?: number;
    maxLength?: number;
    min?: number;
    max?: number;
}

export function validate(validatableInput: Validatable): boolean {
    let isValid = true;
    const { value, required, minLength, maxLength, min, max} = validatableInput;

    if (required) {
        isValid = isValid && value.toString().trim().length > 0;
    }
    if (minLength) {
        isValid = isValid && value.toString().length >= minLength;
    }
    if (maxLength) {
        isValid = isValid && value.toString().length <= maxLength;
    }
    if (min) {
        isValid = isValid && value >= min;
    }
    if (max) {
        isValid = isValid && value <= max
    }
    return isValid;
}
