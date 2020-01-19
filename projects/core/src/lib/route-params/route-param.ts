import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { RouterUtilsService } from '../utils/router-utils.service';
import { map, skip, takeUntil } from 'rxjs/operators';
import { Destroy$ } from '../utils/destroy';

/**
 * Allows you to make the Router param statically typed across many components.
 * Normally you get params by dynamic names like this:
 *
 * constructor(private router: Router) {
 *    const userId = router.snapshot.paramMap.get('userId');
 * }
 * However, you need to use this pattern in every component that has userId access
 *
 * This class allows to do stuff like this:
 * @Injectable()
 * export class UserIdParam extends RouteParam {
 *   paramName() {
 *      return 'userId';
 *   }
 * }
 *
 * And then in the component:
 * constructor(private userIdParam: UserIdParam) {
 *   const userId = userIdParam.value;
 * }
 *
 * This allows to make the param statically typed across many components
 */
@Injectable()
export abstract class RouteParam<T = string> {
  @Destroy$() protected readonly destroy$ = new Subject();

  private _value: T;
  get value() {
    return this._value;
  }

  readonly value$: Observable<T>;
  readonly valueChange$: Observable<T>;

  constructor(protected routerUtils: RouterUtilsService) {
    this.value$ = routerUtils.watchParam(this.paramName())
      .pipe(
        takeUntil(this.destroy$),
        map(param => this.mapParam(param)),
      );

    this.valueChange$ = this.value$.pipe(skip(1));

    this.value$
      .subscribe(value => this._value = value);
  }

  /**
   * fixme change this to abstract field when this project uses TypeScript version with this change
   * @see https://github.com/Microsoft/TypeScript/issues/26411
   */
  protected abstract paramName(): string;

  /**
   * Maps param for given type
   *
   * User can override it.
   */
  mapParam(param: string): T {
    return param as unknown as T;
  }

}
