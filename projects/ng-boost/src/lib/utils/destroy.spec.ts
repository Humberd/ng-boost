import { Destroy$ } from './destroy';
import { Subject } from 'rxjs';
import { OnDestroy } from '@angular/core';

describe('Destroy$', () => {
  it('should complete destroy$ when invoking ngOnDestroy', () => {
    class Test {
      @Destroy$() destroy$ = new Subject();
    }

    const sut = new Test();

    expect(sut.destroy$.isStopped).toBe(false);

    (sut as unknown as OnDestroy).ngOnDestroy();

    expect(sut.destroy$.isStopped).toBe(true);
  });

  it('should complete destroy$ when invoking ngOnDestroy on an already existing ngOnDestroy function', () => {
    class Test implements OnDestroy {
      calledNgOnDestroy = false;
      @Destroy$() destroy$ = new Subject();

      ngOnDestroy(): void {
        this.calledNgOnDestroy = true;
      }
    }

    const sut = new Test();

    expect(sut.destroy$.isStopped).toBe(false);
    expect(sut.calledNgOnDestroy).toBe(false);

    sut.ngOnDestroy();

    expect(sut.destroy$.isStopped).toBe(true);
    expect(sut.calledNgOnDestroy).toBe(true);
    console.log(sut);
  });

});
