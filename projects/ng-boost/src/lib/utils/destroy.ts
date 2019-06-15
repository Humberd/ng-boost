import { Subject } from 'rxjs';

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

