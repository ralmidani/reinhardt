import {
    Validator,
    RequiredValidator,
    NotEmptyValidator,
    MinLengthValidator,
    MaxLengthValidator,
    MinValidator,
    MaxValidator,
    IntegerStepValidator
} from '../src/validators';

describe('RequiredValidator', () => {
    let validatorInstance: RequiredValidator;

    beforeEach(() => {
        validatorInstance = new RequiredValidator();
    });

    test('its status method returns an object with hasError true when passed null or undefined', () => {
        expect(validatorInstance.getErrorStatus(null).hasError).toBe(true);
        expect(validatorInstance.getErrorStatus(undefined).hasError).toBe(true);
    });

    test('its status method returns an object with hasError false when passed a non-null and non-undefined value', () => {
        expect(validatorInstance.getErrorStatus('some string').hasError).toBe(
            false
        );
        expect(validatorInstance.getErrorStatus(1).hasError).toBe(false);
        expect(validatorInstance.getErrorStatus(true).hasError).toBe(false);
        expect(validatorInstance.getErrorStatus(false).hasError).toBe(false);
    });
});

describe('NotEmptyValidator', () => {
    let validatorInstance: NotEmptyValidator;

    beforeEach(() => {
        validatorInstance = new NotEmptyValidator();
    });

    test('its status method returns an object with hasError true when passed an empty string', () => {
        expect(validatorInstance.getErrorStatus('').hasError).toBe(true);
    });

    test('its status method returns an object with hasError false when passed a non-empty string', () => {
        expect(validatorInstance.getErrorStatus('some string').hasError).toBe(
            false
        );
    });
});

describe('MinLengthValidator', () => {
    const minLength = 5;
    let validatorInstance: MinLengthValidator;

    beforeEach(() => {
        validatorInstance = new MinLengthValidator(minLength);
    });

    test('its status method returns an object with hasError true when passed a string shorter than minLength', () => {
        expect(validatorInstance.getErrorStatus('hi').hasError).toBe(true);
    });

    test('its status method returns an object with hasError false when passed a string as long as minLength', () => {
        expect(validatorInstance.getErrorStatus('hello').hasError).toBe(false);
    });

    test('its status method returns an object with hasError false when passed a string longer than minLength', () => {
        expect(validatorInstance.getErrorStatus('hello, world').hasError).toBe(
            false
        );
    });
});

describe('MaxLengthValidator', () => {
    const maxLength = 5;
    let validatorInstance: MaxLengthValidator;

    beforeEach(() => {
        validatorInstance = new MaxLengthValidator(maxLength);
    });

    test('its status method returns an object with hasError false when passed a string shorter than than maxLength', () => {
        expect(validatorInstance.getErrorStatus('hi').hasError).toBe(false);
    });

    test('its status method returns an object with hasError false when passed a string as long as maxLength', () => {
        expect(validatorInstance.getErrorStatus('hello').hasError).toBe(false);
    });

    test('its status method returns an object with hasError false when passed a string longer than maxLength', () => {
        expect(validatorInstance.getErrorStatus('hello, world').hasError).toBe(
            true
        );
    });
});

describe('MinValidator', () => {
    const min = 5;
    let validatorInstance: MinValidator;

    beforeEach(() => {
        validatorInstance = new MinValidator(min);
    });

    test('its status method returns an object with hasError true when passed a number less than min', () => {
        expect(validatorInstance.getErrorStatus(4).hasError).toBe(true);
    });

    test('its status method returns an object with hasError false when passed a number equal to min', () => {
        expect(validatorInstance.getErrorStatus(5).hasError).toBe(false);
    });

    test('its status method returns an object with hasError false when passed a number greater than min', () => {
        expect(validatorInstance.getErrorStatus(6).hasError).toBe(false);
    });
});

describe('MaxValidator', () => {
    const max = 5;
    let validatorInstance: MaxValidator;

    beforeEach(() => {
        validatorInstance = new MaxValidator(max);
    });

    test('its status method returns an object with hasError false when passed a number less than max', () => {
        expect(validatorInstance.getErrorStatus(4).hasError).toBe(false);
    });

    test('its status method returns an object with hasError false when passed a number equal to max', () => {
        expect(validatorInstance.getErrorStatus(5).hasError).toBe(false);
    });

    test('its status method returns an object with hasError false when passed a number greater than max', () => {
        expect(validatorInstance.getErrorStatus(6).hasError).toBe(true);
    });
});


describe('IntegerStepValidator', () => {
    const step = 2;
    let validatorInstance: IntegerStepValidator;

    beforeEach(() => {
        validatorInstance = new IntegerStepValidator(step);
    });

    test('its status method returns an object with hasError true when passed a non-multiple of step', () => {
        expect(validatorInstance.getErrorStatus(1).hasError).toBe(true);
        expect(validatorInstance.getErrorStatus(3).hasError).toBe(true);
    });

    test('its status method returns an object with hasError false when passed a multiple of step', () => {
        expect(validatorInstance.getErrorStatus(0).hasError).toBe(false);
        expect(validatorInstance.getErrorStatus(2).hasError).toBe(false);
        expect(validatorInstance.getErrorStatus(4).hasError).toBe(false);
    });

    test('its validates negative numbers correctly', () => {
        expect(validatorInstance.getErrorStatus(-3).hasError).toBe(true);
        expect(validatorInstance.getErrorStatus(-4).hasError).toBe(false);
    });
});
