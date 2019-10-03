import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormController, FormControllerConfig } from './form.controller';
import { Component } from '@angular/core';
import { By } from '@angular/platform-browser';
import { ngExpect } from '../utils/ng-expect.spec';

describe('FormController', () => {

  function createComponent<T>(component: new (...any) => T) {
    TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
      ],
      declarations: [
        component,
      ],
    }).compileComponents();

    return TestBed.createComponent<T>(component);
  }

  function findElementByCss<T>(fixture: ComponentFixture<T>, cssSelector: string) {
    return fixture.debugElement.query(By.css(cssSelector)).nativeElement;
  }

  it('should test not nested validation', () => {
    interface TestFormValues {
      name: string;
      age: number;
    }

    @Component({
      template: `
        <input
          id="name"
          type="text"
          [formControl]="formDefinition.name"
        >

        <input
          id="age"
          type="number"
          [formControl]="formDefinition.age"
        >
      `,
    })
    class TestForm extends FormController<TestFormValues> {
      getFormDefinition(): FormControllerConfig<TestFormValues> {
        return {
          name: new FormControl('', Validators.required),
          age: new FormControl(0, Validators.min(5)),
        };
      }
    }

    const fixture = createComponent(TestForm);
    fixture.detectChanges();
    ngExpect(findElementByCss(fixture, '#name')).toHaveCssClass('ng-invalid');
    ngExpect(findElementByCss(fixture, '#age')).toHaveCssClass('ng-invalid');

    const formDefinition = fixture.componentInstance.formDefinition;
    formDefinition.name.setValue('Bob');
    formDefinition.age.setValue(5);
    fixture.detectChanges();
    ngExpect(findElementByCss(fixture, '#name')).toHaveCssClass('ng-valid');
    ngExpect(findElementByCss(fixture, '#age')).toHaveCssClass('ng-valid');
  });


});
