import { AbstractControl } from '@angular/forms';

export function votesValidator(control: AbstractControl) {
  let valid = false;
  control.value.options.forEach((value: boolean) => {
    if (value) valid = true;
  });
  return valid ? null : { validVotes: false };
}
