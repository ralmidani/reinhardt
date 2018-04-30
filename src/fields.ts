import {
    ValidatorStatus,
    Validator,
    RequiredValidator,
    NotEmptyValidator,
    MinLengthValidator,
    MaxLengthValidator,
    MinValidator,
    MaxValidator,
    IntegerStepValidator
} from './validators';

export interface Rules {
    required: boolean;
}

export interface FieldValidationErrors {
    fieldHasErrors: boolean;
    TypeValidator?: string;
    RequiredValidator?: string;
    NotEmptyValidator?: string;
    MinLengthValidator?: string;
    MaxLengthValidator?: string;
    MinValidator?: string;
    MaxValidator?: string;
    IntegerStepValidator?: string;
}

export interface FieldInterface {
    getValidationErrors(value: string): FieldValidationErrors;
}

export class Field implements FieldInterface {
    protected static baseType = 'any';
    protected static defaultRules: Rules = {
        required: true
    };
    protected rules: Rules;
    protected validators: Validator[] = [];

    constructor(rules: Rules) {
        this.rules = {
            ...this.constructor.defaultRules,
            ...rules
        };
        if (this.rules.required) {
            this.validators.push(new RequiredValidator());
        }
    }

    getValidationErrors(value: any): FieldValidationErrors {
        const { baseType } = this.constructor;
        if (
            value !== null &&
            value !== undefined &&
            baseType !== 'any' &&
            typeof value !== baseType
        ) {
            return {
                fieldHasErrors: true,
                TypeValidator: `This field's value must be of type ${baseType}`
            }
        }

        let errors: FieldValidationErrors = { fieldHasErrors: false };
        this.validators.forEach((validator: Validator) => {
            const status: ValidatorStatus = validator.getErrorStatus(value);
            if (status.hasError) {
                errors.fieldHasErrors = true;
                errors[validator.constructor.name] = status.message;
            }
        });
        return errors;
    }
}

export interface TextRules extends Rules {
    allowEmpty: boolean;
    minLength?: number;
    maxLength?: number;
}

export class TextField extends Field {
    protected static baseType: string = 'string';
    protected rules: TextRules;
    protected static defaultRules: TextRules = {
        ...Field.defaultRules,
        allowEmpty: false,
        minLength: 1
    };

    constructor(rules: TextRules) {
        super(rules);

        const { allowEmpty, minLength, maxLength } = this.rules;

        if (!allowEmpty) {
            this.validators.push(new NotEmptyValidator());
        }
        if (minLength !== null && minLength !== undefined) {
            this.validators.push(new MinLengthValidator(minLength));
        }
        if (maxLength !== null && maxLength !== undefined) {
            this.validators.push(new MaxLengthValidator(maxLength));
        }
    }

    getValidationErrors(value: string): FieldValidationErrors {
        return Field.prototype.getValidationErrors.call(this, value);
    }
}

export class ShortTextField extends TextField {
    protected static defaultRules: TextRules = {
        ...TextField.defaultRules,
        maxLength: 255
    };
    constructor(protected rules: TextRules) {
        super(rules);
        const { maxLength } = rules;
        if (rules.maxLength !== undefined && rules.maxLength > 255) {
            throw new Error(`
                This class is for fields with a max length under 255.\n
                If you need a field that uses more characters,\n
                use the LongTextField class instead.
            `);
        }
    }
}

export class LongTextField extends TextField {}

export interface IntegerRules extends Rules {
    min?: number;
    max?: number;
    step?: number;
}

export class IntegerField extends Field {
    protected static baseType = 'number';
    protected static defaultRules: IntegerRules = {
        ...Field.defaultRules,
        step: 1
    };
    protected rules: IntegerRules;

    constructor(rules: IntegerRules) {
        super(rules);
        const { min, max, step } = this.rules;
        if (step) {
            if (step < 1) {
                throw new Error('step cannot be less than 1.');
            }
            if (parseInt(step.toString(), 10) !== step) {
                throw new Error('step must be an integer.');
            }
            //
            if (step > 1) this.validators.push(new IntegerStepValidator(step));
        }

        if (min) {
            this.validators.push(new MinValidator(min));
        }
        if (max) {
            this.validators.push(new MaxValidator(max));
        }
    }

    getValidationErrors(value: number): FieldValidationErrors {
        return Field.prototype.getValidationErrors.call(this, value);
    }
}

export class BooleanField extends Field {
    protected static baseType: string = 'boolean';
}
