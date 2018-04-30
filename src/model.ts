import { Field, FieldValidationErrors, BooleanField } from './fields';

export interface ModelValidationErrors {
    modelHasErrors: boolean;
}

export class Model {
    // Consider a more functional pattern
    static getDefinedFields(): object {
        const fields = {};
        for (let fieldName in this) {
            const field = this[fieldName];
            if (field instanceof Field) {
                fields[fieldName] = field;
            }
        }
        return fields;
    }

    // This method is useful for checking an individual field; for
    // example when one field on a form has changed and there is no
    // need to re-validate the ones which have not changed.
    static checkOneField(fieldName: string, value: any): object {
        const field = this[fieldName];
        if (!(field instanceof Field)) {
            throw new Error(
                `${this.constructor.name} does not have a field ${fieldName}`
            );
        }
        return field.getValidationErrors(value);
    }

    // This method is useful for checking some fields of an object
    // without getting errors for null/undefined values. Multi-part
    // forms could make use of this.
    static checkSomeFields(data: object): ModelValidationErrors {
        const modelValidationErrors: ModelValidationErrors = {
            modelHasErrors: false
        };
        Object.entries(data).forEach(([fieldName, value]) => {
            const field: Field = this[fieldName];
            const valueInData = data[fieldName];
            if (field instanceof Field) {
                const fieldValidationErrors =
                    field.getValidationErrors(valueInData);
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
    static checkAllFields(data: object): ModelValidationErrors {
        const modelValidationErrors: ModelValidationErrors = {
            modelHasErrors: false
        };
        for (let fieldName in this.getDefinedFields()) {
            const field: Field = this[fieldName];
            const valueInData = data[fieldName];
            const fieldValidationErrors: FieldValidationErrors =
                field.getValidationErrors(valueInData);
            if (fieldValidationErrors.fieldHasErrors) {
                modelValidationErrors.modelHasErrors = true;
            }
            modelValidationErrors[fieldName] = fieldValidationErrors;
        }
        return modelValidationErrors;
    }
}
