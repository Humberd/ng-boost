import { ControlValueAccessor, FormControl } from '@angular/forms';
import { Input } from '@angular/core';

export abstract class AbstractControlValueAccessor<ValueType> implements ControlValueAccessor {
  @Input() formControl: FormControl;

  isDisabled: boolean;

  // tslint:disable-next-line:variable-name
  private _value: ValueType;
  get value() {
    return this._value;
  }

  set value(value: ValueType) {
    this._value = value;
    this.onChange(value);
    this.onTouched(value);
  }

  onChange = (value: ValueType) => {
  };
  onTouched = (value: ValueType) => {
  };

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
  }

  writeValue(obj: any): void {
    this._value = obj;
  }
}
