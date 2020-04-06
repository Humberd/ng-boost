import { AbstractControl } from '@angular/forms';

/**
 * @see https://stackoverflow.com/a/47010307/4256929
 */
export const hasRequiredField = (abstractControl: AbstractControl): boolean => {
  if (!abstractControl) {
    return false;
  }

  if (abstractControl.validator) {
    const validator = abstractControl.validator({} as AbstractControl);
    if (validator?.required) {
      return true;
    }
  }

  // tslint:disable-next-line
  const controls: { [key: string]: AbstractControl } = abstractControl['controls'];
  if (controls) {
    for (const control of Object.values(controls)) {
      if (hasRequiredField(control)) {
        return true;
      }
    }
  }

  return false;
};
