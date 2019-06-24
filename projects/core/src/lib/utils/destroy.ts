import { Subject } from 'rxjs';

/**
 * Destroys decorated {Subject} in {OnDestoy} phase, so that we don't have to clutter the code with boilerplate
 * For example:
 *
 * Without decorator:
 * ```
 * @Component({...})
 * class Component implements OnDestroy {
 *   private readonly destroy$ = new Subject();
 *
 *   ngOnDestroy() {
 *     this.destroy$.next();
 *     this.destroy$.complete();
 *   }
 * }
 * ```
 *
 * With decorator:
 * ```
 * @Component({...})
 * class Component implements {
 *   @Destroy$() private readonly destroy$ = new Subject();
 * }
 * ```
 *
 * In case of existing {ngOnDestroy} method it will add the destroy feature BEFORE invoking of the existing ones.
 */
export function Destroy$(): PropertyDecorator {
  return (target: any, propertyKey) => {
    const destroyFn = function() {
      (this[propertyKey] as Subject<any>).next();
      (this[propertyKey] as Subject<any>).complete();
    };

    if (typeof target.ngOnDestroy === 'function') {
      const oldNgOnDestroy = target.ngOnDestroy;
      target.ngOnDestroy = function() {
        destroyFn.call(this);
        oldNgOnDestroy.call(this);
      };
    } else {
      target.ngOnDestroy = destroyFn;
    }

  };
}

