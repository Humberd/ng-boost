import { takeUntil } from 'rxjs/operators';
import { FormGroup } from '@angular/forms';
import { BehaviorSubject, Observable } from 'rxjs';
import { FormController } from './form.controller';

export abstract class FormRootController<T> extends FormController<T> {
  private readonly _isLoading$ = new BehaviorSubject(false);
  isLoading$ = this._isLoading$.asObservable();

  get isLoading() {
    return this._isLoading$.value;
  }

  submit(): void {
    this.markAsTouched();

    if (this.rootForm.invalid) {
      console.error('Invalid form');
      return;
    }

    console.log('Form is valid');

    this._isLoading$.next(true);

    this.submitAction(this.rootForm.value)
    /* When we cancel a form we don't want the request to be handled anymore  */
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        {
          next: value => {
            this._onSuccess(value);
            this.onSuccess(value);
          },
          error: err => {
            this._onError(err);
            this.onError(err);
          }
        }
      );
  }

  protected abstract submitAction(values: T): Observable<any>;

  private _onSuccess(success: any): void {
    this._isLoading$.next(false);
  }

  protected onSuccess(success: any): void {
    /* User defined method */
  }

  private _onError(err: any): void {
    console.error(err);
    this._isLoading$.next(false);
  }

  protected onError(err: any): void {
    /* User defined method */
  }

  private markAsTouched(): void {
    this._markAsTouched(this.rootForm);
    this.onPush = !this.onPush;
  }

  /**
   * Invoking `markAsTouched()` on the rootForm doesn't propagate the state to its children.
   * We have to manually set touched state on all of its children.
   * @see https://github.com/angular/angular/issues/12281#issuecomment-428232246
   */
  private _markAsTouched(formGroup: FormGroup): void {
    (Object as any).values(formGroup.controls).forEach(control => {
      control.markAsTouched();

      if (control.controls) {
        this._markAsTouched(control);
      }
    });
  }
}
