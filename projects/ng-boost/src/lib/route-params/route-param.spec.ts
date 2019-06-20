import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { NoopModule } from '../utils/noop.module';
import { RouterTestingModule } from '@angular/router/testing';
import { Component, Injectable, NgZone, Provider } from '@angular/core';
import { Router, Routes } from '@angular/router';
import { RouterParam } from './route-param';
import { RouterUtilsService } from '../utils/router-utils.service';

describe('RouteParam', () => {

  function createService({routes = [], providers = [], declarations = []}: { routes: Routes, providers?: Provider[], declarations?: any[] }) {
    TestBed.configureTestingModule({
      declarations: [
        ...declarations
      ],
      imports: [
        NoopModule,
        RouterTestingModule.withRoutes(routes)
      ],
      providers: [
        ...providers,
        RouterUtilsService
      ]
    }).compileComponents();

    const ngZone: NgZone = TestBed.get(NgZone);
    const router: Router = TestBed.get(Router);

    return {ngZone, router};
  }

  it('should detect route params changes', fakeAsync(() => {
    @Injectable()
    class UserIdRouteParam extends RouterParam {
      protected paramName(): string {
        return 'userId';
      }

    }

    @Component({
      template: '<div>foo</div>',
      viewProviders: [
        UserIdRouteParam
      ]
    })
    class RouteComponent {
      constructor(public userIdRouteParam: UserIdRouteParam) {
      }
    }

    const {ngZone, router} = createService({
      declarations: [RouteComponent],
      routes: [
        {
          path: 'users/:userId',
          component: RouteComponent,
        },
      ]
    });

    // ************** 1st change *************
    ngZone.run(() => {
      router.navigateByUrl('/users/admin');
    });
    tick(0);

    /* Component is not created on route change. Need to create it manually */
    const componentFixture = TestBed.createComponent(RouteComponent);
    const component = componentFixture.componentInstance;

    let value: string;
    let value$Completed: boolean;
    component.userIdRouteParam.value$
      .subscribe({
        next: value1 => value = value1,
        complete: () => value$Completed = true
      });

    let valueChange: string;
    let valueChange$Complete: boolean;
    component.userIdRouteParam.valueChange$
      .subscribe({
        next: value1 => valueChange = value1,
        complete: () => valueChange$Complete = true
      });

    expect(component.userIdRouteParam.value).toBe('admin');
    expect(value).toBe('admin');
    expect(valueChange).toBe(undefined);

    // ************** 2nd change *************
    ngZone.run(() => {
      router.navigateByUrl('/users/john');
    });
    tick(0);

    expect(component.userIdRouteParam.value).toBe('john');
    expect(value).toBe('john');
    expect(valueChange).toBe('john');

    componentFixture.destroy();
    expect(value$Completed).toBe(true);
    expect(valueChange$Complete).toBe(true);

  }));

  it('should not emit any values when providing a not existing field name', fakeAsync(() => {
    @Injectable()
    class UserIdRouteParam extends RouterParam {
      protected paramName(): string {
        return 'groupId'; // <-- notice here a wrong paramName
      }

    }

    @Component({
      template: '<div>foo</div>',
      viewProviders: [
        UserIdRouteParam
      ]
    })
    class RouteComponent {
      constructor(public userIdRouteParam: UserIdRouteParam) {
      }
    }

    const {ngZone, router} = createService({
      declarations: [RouteComponent],
      routes: [
        {
          path: 'users/:userId',
          component: RouteComponent,
        },
      ]
    });

    // ************** 1st change *************
    ngZone.run(() => {
      router.navigateByUrl('/users/admin');
    });
    tick(0);

    /* Component is not created on route change. Need to create it manually */
    const componentFixture = TestBed.createComponent(RouteComponent);
    const component = componentFixture.componentInstance;

    let value: string;
    let value$Completed: boolean;
    component.userIdRouteParam.value$
      .subscribe({
        next: value1 => value = value1,
        complete: () => value$Completed = true
      });

    let valueChange: string;
    let valueChange$Complete: boolean;
    component.userIdRouteParam.valueChange$
      .subscribe({
        next: value1 => valueChange = value1,
        complete: () => valueChange$Complete = true
      });

    expect(component.userIdRouteParam.value).toBe(undefined);
    expect(value).toBe(undefined);
    expect(valueChange).toBe(undefined);

    // ************** 2nd change *************
    ngZone.run(() => {
      router.navigateByUrl('/users/john');
    });
    tick(0);

    expect(component.userIdRouteParam.value).toBe(undefined);
    expect(value).toBe(undefined);
    expect(valueChange).toBe(undefined);

    componentFixture.destroy();
    expect(value$Completed).toBe(true);
    expect(valueChange$Complete).toBe(true);

  }));

});
