import { AbstractControl, AbstractControlOptions, FormGroup } from '@angular/forms';
import { ApplicationRef, ChangeDetectorRef, Injectable, Input, NgZone, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { Destroy$ } from '../utils/destroy';

export type FormControllerConfig<T> = {
  [key in keyof T]?: AbstractControl
};

@Injectable()
export abstract class FormController<T> implements OnInit {
  @Destroy$() protected readonly destroy$ = new Subject();

  @Input() marker: any;

  @Input() formGroupTemplate: FormGroup;
  formDefinition: FormControllerConfig<T>;
  rootForm: FormGroup;

  constructor(protected cdr: ChangeDetectorRef,
              protected applicationRef: ApplicationRef,
              protected ngZone: NgZone) {
  }

  ngOnInit(): void {
    const group = this.formGroupTemplate || new FormGroup({});
    this.formDefinition = this.getFormDefinition();

    Object.entries(this.formDefinition)
      .forEach(([key, value]: [string, AbstractControl]) => {
        group.setControl(key, value);
      });

    const {validators, asyncValidators} = this.getFormOptions();

    group.setValidators(validators);
    group.setAsyncValidators(asyncValidators);

    this.rootForm = group;
  }

  abstract getFormDefinition(): FormControllerConfig<T>;

  getFormOptions(): AbstractControlOptions {
    return {};
  }
}
