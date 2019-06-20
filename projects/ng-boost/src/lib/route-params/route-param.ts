import { Injectable } from '@angular/core';
import { EMPTY, Observable, Subject } from 'rxjs';
import { RouterUtilsService } from '../utils/router-utils.service';
import { skip, takeUntil } from 'rxjs/operators';
import { Destroy$ } from '../utils/destroy';

@Injectable({
  providedIn: null,
  deps: [RouterUtilsService]
})
export abstract class RouterParam {
  @Destroy$() protected readonly destroy$ = new Subject();

  protected value: string;
  protected value$: Observable<string>;
  protected valueChange$: Observable<string>;

  constructor(protected routerUtils: RouterUtilsService) {
    this.value$ = (routerUtils.getParam$(this.fieldName()) || EMPTY)
      .pipe(takeUntil(this.destroy$));

    this.valueChange$ = this.value$.pipe(skip(1));

    this.value$
      .subscribe(value => this.value = value);
  }

  /**
   * fixme change this to abstract field when this project uses TypeScript version with this change
   * @see https://github.com/Microsoft/TypeScript/issues/26411
   */
  protected abstract fieldName(): string;

}
