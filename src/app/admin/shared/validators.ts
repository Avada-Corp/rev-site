import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { FormGroup, Validators } from '@angular/forms';

export function atLeastStringOne(...fields: string[]) {
  return (fg: FormGroup): ValidationErrors | null => {
    const isSome = fields.some((fieldName) => {
      const field = fg.get(fieldName)?.value;
      return Boolean(field);
    });
    const res = isSome
      ? null
      : ({
          atLeastOne: 'At least one field has to be provided.',
        } as ValidationErrors);
    return res;
  };
}

export function forbiddenNameValidator(name: string): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const { value = null } = control?.value || {};
    return value == null ? { [name]: { value: control.value } } : null;
  };
}
