"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fields_1 = require("./fields");
class Model {
    // Consider a more functional pattern
    static getDefinedFields() {
        const fields = {};
        for (let fieldName in this) {
            const field = this[fieldName];
            if (field instanceof fields_1.Field) {
                fields[fieldName] = field;
            }
        }
        return fields;
    }
    // This method is useful for checking an individual field; for
    // example when one field on a form has changed and there is no
    // need to re-validate the ones which have not changed.
    static checkOneField(fieldName, value) {
        const field = this[fieldName];
        if (!(field instanceof fields_1.Field)) {
            throw new Error(`${this.constructor.name} does not have a field ${fieldName}`);
        }
        return field.getValidationErrors(value);
    }
    // This method is useful for checking some fields of an object
    // without getting errors for null/undefined values. Multi-part
    // forms could make use of this.
    static checkSomeFields(data) {
        const modelValidationErrors = {
            modelHasErrors: false
        };
        Object.entries(data).forEach(([fieldName, value]) => {
            const field = this[fieldName];
            const valueInData = data[fieldName];
            if (field instanceof fields_1.Field) {
                const fieldValidationErrors = field.getValidationErrors(valueInData);
                if (fieldValidationErrors.fieldHasErrors) {
                    modelValidationErrors.modelHasErrors = true;
                }
                modelValidationErrors[fieldName] = fieldValidationErrors;
            }
        });
        return modelValidationErrors;
    }
    // This method is useful for checking a "complete" object
    // (in the sense that all of its fields should have been
    // filled out).
    static checkAllFields(data) {
        const modelValidationErrors = {
            modelHasErrors: false
        };
        for (let fieldName in this.getDefinedFields()) {
            const field = this[fieldName];
            const valueInData = data[fieldName];
            const fieldValidationErrors = field.getValidationErrors(valueInData);
            if (fieldValidationErrors.fieldHasErrors) {
                modelValidationErrors.modelHasErrors = true;
            }
            modelValidationErrors[fieldName] = fieldValidationErrors;
        }
        return modelValidationErrors;
    }
}
exports.Model = Model;
