import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { BoostBreadcrumbsService } from './boost-breadcrumbs.service';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRouteSnapshot, Route, Router, RouterStateSnapshot } from '@angular/router';
import { Injectable, NgZone } from '@angular/core';
import { filter, first, map } from 'rxjs/operators';
import { Breadcrumb } from '../_models/breadcrumb';
import { BehaviorSubject, Observable } from 'rxjs';
import { NoopComponent, NoopModule } from '../../utils/noop.module';
import { BreadcrumbsResolver } from './breadcrumbs.resolver';
import { RouterUtilsService } from '../../utils/router-utils.service';
import { BreadcrumbsDefaultResolver } from './breadcrumbs-default.resolver';


describe('BreadcrumbsService', () => {
  function createService({routes = [], providers = []} = {}) {
    TestBed.configureTestingModule({
      imports: [
        NoopModule,
        RouterTestingModule.withRoutes(routes)
      ],
      providers: [
        BoostBreadcrumbsService,
        BreadcrumbsDefaultResolver,
        RouterUtilsService,
        ...providers
      ]
    });

    const service: BoostBreadcrumbsService = TestBed.get(BoostBreadcrumbsService);
    const ngZone: NgZone = TestBed.get(NgZone);
    const router: Router = TestBed.get(Router);

    return {service, ngZone, router};
  }

  it('should be created', () => {
    const {service} = createService();
    expect(service).toBeTruthy();
  });

  describe('updating breadcrumbs$ on NavigationEnd', () => {

    it('should emit 3 breadcrumbs', fakeAsync(() => {
      const {service, ngZone, router} = createService({
        routes: [
          {
            path: 'first',
            component: NoopComponent,
            data: {
              breadcrumbs: 'First',
            },
            children: [
              {
                path: 'second',
                component: NoopComponent,
                data: {
                  breadcrumbs: 'Second',
                },
                children: [
                  {
                    path: 'third',
                    component: NoopComponent,
                    data: {
                      breadcrumbs: 'Third'
                    }
                  }
                ]
              }
            ]
          } as Route,
        ]
      });

      ngZone.run(() => {
        router.navigateByUrl('/first/second/third');
      });

      tick(0);
      expect(service.breadcrumbs).toEqual([{
        label: 'First',
        href: '/first'
      }, {
        label: 'Second',
        href: '/first/second'
      }, {
        label: 'Third',
        href: '/first/second/third'
      }]);
    }));

    it('should skip the second breadcrumb when a route didn\'t provide any data', fakeAsync(() => {
      const {service, router, ngZone} = createService({
        routes: [
          {
            path: 'first',
            component: NoopComponent,
            data: {
              breadcrumbs: 'First',
            },
            children: [
              {
                path: 'second',
                component: NoopComponent,
                children: [
                  {
                    path: 'third',
                    component: NoopComponent,
                    data: {
                      breadcrumbs: 'Third'
                    }
                  }
                ]
              }
            ]
          } as Route,
        ]
      });

      ngZone.run(() => {
        router.navigateByUrl('/first/second/third');
      });

      tick(0);
      expect(service.breadcrumbs).toEqual([{
        label: 'First',
        href: '/first'
      }, {
        label: 'Third',
        href: '/first/second/third'
      }]);
    }));

    it('should get a data from the resolver', fakeAsync(() => {
      @Injectable()
      class SimpleTestResolver extends BreadcrumbsResolver {
        resolve(
          route: ActivatedRouteSnapshot,
          state: RouterStateSnapshot
        ): Observable<Breadcrumb[]> | Promise<Breadcrumb[]> | Breadcrumb[] {
          return [{
            label: 'overriden-text',
            href: '/overriden-path'
          }];
        }

      }

      const {service, ngZone, router} = createService({
        providers: [
          SimpleTestResolver
        ],
        routes: [
          {
            path: 'first',
            component: NoopComponent,
            data: {
              breadcrumbs: 'First',
            },
            children: [
              {
                path: 'second',
                component: NoopComponent,
                data: {
                  breadcrumbs: SimpleTestResolver
                },
                children: [
                  {
                    path: 'third',
                    component: NoopComponent,
                    data: {
                      breadcrumbs: 'Third'
                    }
                  }
                ]
              }
            ]
          } as Route,
        ]
      });

      ngZone.run(() => {
        router.navigateByUrl('/first/second/third');
      });

      tick(0);
      expect(service.breadcrumbs).toEqual([{
        label: 'First',
        href: '/first'
      }, {
        label: 'overriden-text',
        href: '/overriden-path'
      }, {
        label: 'Third',
        href: '/first/second/third'
      }]);

    }));

    it('should be possible to inject any classes inside a resolver', fakeAsync(() => {
      @Injectable()
      class TranslationService {
        getName(): string {
          return 'translatedName';
        }
      }

      @Injectable()
      class SimpleTestResolver extends BreadcrumbsResolver {
        constructor(private translationService: TranslationService) {
          super();
        }

        resolve(
          route: ActivatedRouteSnapshot,
          state: RouterStateSnapshot
        ): Observable<Breadcrumb[]> | Promise<Breadcrumb[]> | Breadcrumb[] {
          return [{
            label: this.translationService.getName(),
            href: '/overriden-path'
          }];
        }

      }

      const {service, ngZone, router} = createService({
        providers: [
          TranslationService,
          SimpleTestResolver
        ],
        routes: [
          {
            path: 'first',
            component: NoopComponent,
            data: {
              breadcrumbs: 'First',
            },
            children: [
              {
                path: 'second',
                component: NoopComponent,
                data: {
                  breadcrumbs: SimpleTestResolver
                },
                children: [
                  {
                    path: 'third',
                    component: NoopComponent,
                    data: {
                      breadcrumbs: 'Third'
                    }
                  }
                ]
              }
            ]
          } as Route,
        ]
      });

      ngZone.run(() => {
        router.navigateByUrl('/first/second/third');
      });

      tick(0);
      expect(service.breadcrumbs).toEqual([{
        label: 'First',
        href: '/first'
      }, {
        label: 'translatedName',
        href: '/overriden-path'
      }, {
        label: 'Third',
        href: '/first/second/third'
      }]);
    }));

    it('should dynamically change the breadcrumb info when resolver returned an observable', fakeAsync(() => {
      @Injectable()
      class SimpleTestResolver extends BreadcrumbsResolver {
        _subject = new BehaviorSubject<string>(null);

        resolve(
          route: ActivatedRouteSnapshot,
          state: RouterStateSnapshot
        ): Observable<Breadcrumb[]> | Promise<Breadcrumb[]> | Breadcrumb[] {
          return this._subject
            .pipe(
              filter(it => !!it),
              map(it => ([{
                href: '/overriden-path',
                label: it
              }]))
            );
        }

      }

      const {service, ngZone, router} = createService({
        providers: [
          SimpleTestResolver
        ],
        routes: [
          {
            path: 'first',
            component: NoopComponent,
            data: {
              breadcrumbs: SimpleTestResolver,
            },
          } as Route,
        ]
      });

      const simpleTestResolver: SimpleTestResolver = TestBed.get(SimpleTestResolver);

      ngZone.run(() => {
        router.navigateByUrl('/first');
      });

      tick(0);
      expect(service.breadcrumbs).toEqual([]);

      simpleTestResolver._subject.next('hello');
      expect(service.breadcrumbs).toEqual([{
        label: 'hello',
        href: '/overriden-path'
      }]);

      simpleTestResolver._subject.next('world');
      expect(service.breadcrumbs).toEqual([{
        label: 'world',
        href: '/overriden-path'
      }]);

    }));

    it('should dynamically change 2 breadcrumbs info when resolver returned an observable for both of them', fakeAsync(() => {
      @Injectable()
      class SimpleTestResolver1 extends BreadcrumbsResolver {
        _subject = new BehaviorSubject<string>(null);

        resolve(
          route: ActivatedRouteSnapshot,
          state: RouterStateSnapshot
        ): Observable<Breadcrumb[]> | Promise<Breadcrumb[]> | Breadcrumb[] {
          return this._subject
            .pipe(
              filter(it => !!it),
              map(it => ([{
                href: '/',
                label: it
              }]))
            );
        }
      }

      @Injectable()
      class SimpleTestResolver2 extends BreadcrumbsResolver {
        _subject = new BehaviorSubject<string>(null);

        resolve(
          route: ActivatedRouteSnapshot,
          state: RouterStateSnapshot
        ): Observable<Breadcrumb[]> | Promise<Breadcrumb[]> | Breadcrumb[] {
          return this._subject
            .pipe(
              filter(it => !!it),
              map(it => ([{
                href: '/',
                label: it
              }]))
            );
        }
      }

      const {service, ngZone, router} = createService({
        providers: [
          SimpleTestResolver1,
          SimpleTestResolver2
        ],
        routes: [
          {
            path: 'first',
            component: NoopComponent,
            data: {
              breadcrumbs: SimpleTestResolver1,
            },
            children: [
              {
                path: 'second',
                component: NoopComponent,
                data: {
                  breadcrumbs: SimpleTestResolver2
                }
              }
            ]
          } as Route,
        ]
      });

      const resolver1: SimpleTestResolver1 = TestBed.get(SimpleTestResolver1);
      const resolver2: SimpleTestResolver2 = TestBed.get(SimpleTestResolver2);

      ngZone.run(() => {
        router.navigateByUrl('/first/second');
      });

      tick(0);
      expect(service.breadcrumbs).toEqual([]);

      resolver1._subject.next('Alice');
      expect(service.breadcrumbs).toEqual([]);

      resolver2._subject.next('Bob');
      expect(service.breadcrumbs).toEqual([{
        label: 'Alice',
        href: '/'
      }, {
        label: 'Bob',
        href: '/',
      }]);

      resolver1._subject.next('Alice goes');
      expect(service.breadcrumbs).toEqual([{
        label: 'Alice goes',
        href: '/'
      }, {
        label: 'Bob',
        href: '/'
      }]);

      resolver2._subject.next('Bob goes');
      expect(service.breadcrumbs).toEqual([{
        label: 'Alice goes',
        href: '/'
      }, {
        label: 'Bob goes',
        href: '/'
      }]);

    }));

    it('should unsubscribe from the resolver when it changes the route', fakeAsync(() => {
      @Injectable()
      class SimpleTestResolver1 extends BreadcrumbsResolver {
        _subject = new BehaviorSubject<string>(null);

        resolve(
          route: ActivatedRouteSnapshot,
          state: RouterStateSnapshot
        ): Observable<Breadcrumb[]> | Promise<Breadcrumb[]> | Breadcrumb[] {
          return this._subject
            .pipe(
              filter(it => !!it),
              map(it => ([{
                href: '/',
                label: it
              }]))
            );
        }
      }

      @Injectable()
      class SimpleTestResolver2 extends BreadcrumbsResolver {
        _subject = new BehaviorSubject<string>(null);

        resolve(
          route: ActivatedRouteSnapshot,
          state: RouterStateSnapshot
        ): Observable<Breadcrumb[]> | Promise<Breadcrumb[]> | Breadcrumb[] {
          return this._subject
            .pipe(
              filter(it => !!it),
              map(it => ([{
                href: '/',
                label: it
              }]))
            );
        }
      }

      const {service, router, ngZone} = createService({
        providers: [
          SimpleTestResolver1,
          SimpleTestResolver2
        ],
        routes: [
          {
            path: 'first',
            component: NoopComponent,
            data: {
              breadcrumbs: SimpleTestResolver1,
            },
            children: [
              {
                path: 'second',
                component: NoopComponent,
                data: {
                  breadcrumbs: SimpleTestResolver2
                }
              }
            ]
          } as Route,
        ]
      });

      const resolver1: SimpleTestResolver1 = TestBed.get(SimpleTestResolver1);
      const resolver2: SimpleTestResolver2 = TestBed.get(SimpleTestResolver2);

      ngZone.run(() => {
        router.navigateByUrl('/first/second');
      });

      tick(0);
      expect(service.breadcrumbs).toEqual([]);

      resolver1._subject.next('Alice');
      resolver2._subject.next('Bob');
      expect(service.breadcrumbs).toEqual([{
        label: 'Alice',
        href: '/'
      }, {
        label: 'Bob',
        href: '/',
      }]);

      ngZone.run(() => {
        router.navigateByUrl('/first');
      });

      tick(0);
      expect(service.breadcrumbs).toEqual([{
        label: 'Alice',
        href: '/'
      }]);

      expect(resolver1._subject.observers.length).toEqual(1);
      expect(resolver2._subject.observers.length).toEqual(0);
    }));

  });
});
