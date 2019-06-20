import { Injectable } from '@angular/core';
import { EMPTY, Observable, Subject } from 'rxjs';
import { RouterUtilsService } from '../utils/router-utils.service';
import { skip, takeUntil } from 'rxjs/operators';
import { Destroy$ } from '../utils/destroy';

@Injectable()
export abstract class RouteParam {
  @Destroy$() protected readonly destroy$ = new Subject();

  private _value: string;
  get value() {
    return this._value;
  }

  readonly value$: Observable<string>;
  readonly valueChange$: Observable<string>;

  constructor(protected routerUtils: RouterUtilsService) {
    this.value$ = (routerUtils.getParam$(this.paramName()) || EMPTY)
      .pipe(takeUntil(this.destroy$));

    this.valueChange$ = this.value$.pipe(skip(1));

    this.value$
      .subscribe(value => this._value = value);
  }

  /**
   * fixme change this to abstract field when this project uses TypeScript version with this change
   * @see https://github.com/Microsoft/TypeScript/issues/26411
   */
  protected abstract paramName(): string;

}
