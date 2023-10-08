import { FormGroup } from "@angular/forms"

export const confirmPassValidator = (controlName: string, controlNameToMatch: string) => {
    return (formGroup: FormGroup) => {
        let control = formGroup.controls[controlName];
        let nameToMatch = formGroup.controls[controlNameToMatch];
        if (nameToMatch.errors && !nameToMatch.errors['confirmPassValidator']) {
            return;
        }
        if (control.value !== nameToMatch.value) {
            nameToMatch.setErrors({ confirmPassValidator: true });
        } else {
            nameToMatch.setErrors(null);
        }
    }
}