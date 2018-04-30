export interface Validator {
    getErrorStatus(value: any): ValidatorStatus;
}

export interface ValidatorStatus {
    hasError: boolean;
    message?: string;
}

const noErrorValidatorStatus: ValidatorStatus = {
    hasError: false
};

export class RequiredValidator implements Validator {
    getErrorStatus(value: any): ValidatorStatus {
        return value === null || value === undefined
            ? { hasError: true, message: 'this field is required' }
            : noErrorValidatorStatus;
    }
}

export class NotEmptyValidator implements Validator {
    getErrorStatus(value: string): ValidatorStatus {
        return value !== null && value !== undefined && value.length === 0
            ? { hasError: true, message: 'this field cannot be empty' }
            : noErrorValidatorStatus;
    }
}

export class MinLengthValidator implements Validator {
    constructor(private minLength: number) {}

    getErrorStatus(value: string): ValidatorStatus {
        const { minLength } = this;
        return value.length < minLength
            ? {
                  hasError: true,
                  message:
                      `this field cannot be shorter than ${minLength} characters`
              }
            : noErrorValidatorStatus;
    }
}

export class MaxLengthValidator implements Validator {
    constructor(private maxLength: number) {}

    getErrorStatus(value: string): ValidatorStatus {
        const { maxLength } = this;
        return value.length > maxLength
            ? {
                  hasError: true,
                  message:
                      `this field cannot be longer than ${maxLength} characters`
              }
            : noErrorValidatorStatus;
    }
}

export class MinValidator implements Validator {
    constructor(private min: number) {}

    getErrorStatus(value: number): ValidatorStatus {
        const { min } = this;
        return value < min
            ? {
                  hasError: true,
                  message: `this field cannot be less than ${min}`
              }
            : noErrorValidatorStatus;
    }
}

export class MaxValidator implements Validator {
    constructor(private max: number) {}

    getErrorStatus(value: number): ValidatorStatus {
        const { max } = this;
        return value > max
            ? {
                  hasError: true,
                  message: `this field cannot be greater than ${max}`
              }
            : noErrorValidatorStatus;
    }
}

export class IntegerStepValidator implements Validator {
    constructor(private step: number) {}

    getErrorStatus(value: number): ValidatorStatus {
        const { step } = this;
        return parseInt(value.toString(), 10) % step !== 0
            ? {
                  hasError: true,
                  message: `this field must be a mutiple of ${step}`
              }
            : noErrorValidatorStatus;
    }
}
