import { AbstractControl, AbstractControlOptions, FormArray, FormControl, FormGroup } from '@angular/forms';
import { Input, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { Destroy$ } from '../utils/destroy';

export type FormControllerConfig<T> = {
  [key in keyof T]?: AbstractControl | FormControl | FormGroup | FormArray
};

export abstract class FormController<FormDefinition, FormInitialValues = FormDefinition> implements OnInit {
  @Destroy$() protected readonly destroy$ = new Subject();

  /**
   * When your component has a `changeDetection: OnPush` you should pass
   * this variable down to other children FormControllers.
   * Otherwise the children FormControllers' error states will not be visible.
   */
  @Input() onPush: any;
  @Input() initialValues?: FormInitialValues;
  @Input() formGroupTemplate: FormGroup;
  formDefinition: FormControllerConfig<FormDefinition>;
  rootForm: FormGroup;

  ngOnInit(): void {
    const group = this.formGroupTemplate || new FormGroup({});
    this.formDefinition = this.getFormDefinition();

    Object.entries(this.formDefinition || {})
      .forEach(([key, value]: [string, AbstractControl]) => {
        group.setControl(key, value);
      });

    const {validators, asyncValidators} = this.getFormOptions();

    group.setValidators(validators);
    group.setAsyncValidators(asyncValidators);

    this.rootForm = group;
  }

  abstract getFormDefinition(): FormControllerConfig<FormDefinition>;

  getFormOptions(): AbstractControlOptions {
    return {};
  }
}
