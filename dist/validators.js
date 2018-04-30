"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const noErrorValidatorStatus = {
    hasError: false
};
class RequiredValidator {
    getErrorStatus(value) {
        return value === null || value === undefined
            ? { hasError: true, message: 'this field is required' }
            : noErrorValidatorStatus;
    }
}
exports.RequiredValidator = RequiredValidator;
class NotEmptyValidator {
    getErrorStatus(value) {
        return value !== null && value !== undefined && value.length === 0
            ? { hasError: true, message: 'this field cannot be empty' }
            : noErrorValidatorStatus;
    }
}
exports.NotEmptyValidator = NotEmptyValidator;
class MinLengthValidator {
    constructor(minLength) {
        this.minLength = minLength;
    }
    getErrorStatus(value) {
        const { minLength } = this;
        return value.length < minLength
            ? {
                hasError: true,
                message: `this field cannot be shorter than ${minLength} characters`
            }
            : noErrorValidatorStatus;
    }
}
exports.MinLengthValidator = MinLengthValidator;
class MaxLengthValidator {
    constructor(maxLength) {
        this.maxLength = maxLength;
    }
    getErrorStatus(value) {
        const { maxLength } = this;
        return value.length > maxLength
            ? {
                hasError: true,
                message: `this field cannot be longer than ${maxLength} characters`
            }
            : noErrorValidatorStatus;
    }
}
exports.MaxLengthValidator = MaxLengthValidator;
class MinValidator {
    constructor(min) {
        this.min = min;
    }
    getErrorStatus(value) {
        const { min } = this;
        return value < min
            ? {
                hasError: true,
                message: `this field cannot be less than ${min}`
            }
            : noErrorValidatorStatus;
    }
}
exports.MinValidator = MinValidator;
class MaxValidator {
    constructor(max) {
        this.max = max;
    }
    getErrorStatus(value) {
        const { max } = this;
        return value > max
            ? {
                hasError: true,
                message: `this field cannot be greater than ${max}`
            }
            : noErrorValidatorStatus;
    }
}
exports.MaxValidator = MaxValidator;
class IntegerStepValidator {
    constructor(step) {
        this.step = step;
    }
    getErrorStatus(value) {
        const { step } = this;
        return parseInt(value.toString(), 10) % step !== 0
            ? {
                hasError: true,
                message: `this field must be a mutiple of ${step}`
            }
            : noErrorValidatorStatus;
    }
}
exports.IntegerStepValidator = IntegerStepValidator;
