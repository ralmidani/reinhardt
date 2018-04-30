"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const validators_1 = require("./validators");
class Field {
    constructor(rules) {
        this.validators = [];
        this.rules = Object.assign({}, this.constructor.defaultRules, rules);
        if (this.rules.required) {
            this.validators.push(new validators_1.RequiredValidator());
        }
    }
    getValidationErrors(value) {
        const { baseType } = this.constructor;
        if (value !== null &&
            value !== undefined &&
            baseType !== 'any' &&
            typeof value !== baseType) {
            return {
                fieldHasErrors: true,
                TypeValidator: `This field's value must be of type ${baseType}`
            };
        }
        let errors = { fieldHasErrors: false };
        this.validators.forEach((validator) => {
            const status = validator.getErrorStatus(value);
            if (status.hasError) {
                errors.fieldHasErrors = true;
                errors[validator.constructor.name] = status.message;
            }
        });
        return errors;
    }
}
Field.baseType = 'any';
Field.defaultRules = {
    required: true
};
exports.Field = Field;
class TextField extends Field {
    constructor(rules) {
        super(rules);
        const { allowEmpty, minLength, maxLength } = this.rules;
        if (!allowEmpty) {
            this.validators.push(new validators_1.NotEmptyValidator());
        }
        if (minLength !== null && minLength !== undefined) {
            this.validators.push(new validators_1.MinLengthValidator(minLength));
        }
        if (maxLength !== null && maxLength !== undefined) {
            this.validators.push(new validators_1.MaxLengthValidator(maxLength));
        }
    }
    getValidationErrors(value) {
        return Field.prototype.getValidationErrors.call(this, value);
    }
}
TextField.baseType = 'string';
TextField.defaultRules = Object.assign({}, Field.defaultRules, { allowEmpty: false, minLength: 1 });
exports.TextField = TextField;
class ShortTextField extends TextField {
    constructor(rules) {
        super(rules);
        this.rules = rules;
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
ShortTextField.defaultRules = Object.assign({}, TextField.defaultRules, { maxLength: 255 });
exports.ShortTextField = ShortTextField;
class LongTextField extends TextField {
}
exports.LongTextField = LongTextField;
class IntegerField extends Field {
    constructor(rules) {
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
            if (step > 1)
                this.validators.push(new validators_1.IntegerStepValidator(step));
        }
        if (min) {
            this.validators.push(new validators_1.MinValidator(min));
        }
        if (max) {
            this.validators.push(new validators_1.MaxValidator(max));
        }
    }
    getValidationErrors(value) {
        return Field.prototype.getValidationErrors.call(this, value);
    }
}
IntegerField.baseType = 'number';
IntegerField.defaultRules = Object.assign({}, Field.defaultRules, { step: 1 });
exports.IntegerField = IntegerField;
class BooleanField extends Field {
}
BooleanField.baseType = 'boolean';
exports.BooleanField = BooleanField;
