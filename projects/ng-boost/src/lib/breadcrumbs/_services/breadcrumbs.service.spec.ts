import { TestBed } from '@angular/core/testing';
import { BoostBreadcrumbsService } from './boost-breadcrumbs.service';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRouteSnapshot, Route, Router, RouterStateSnapshot } from '@angular/router';
import { Injectable } from '@angular/core';
import { filter, first, map, skip } from 'rxjs/operators';
import { Breadcrumb } from '../_models/breadcrumb';
import { BehaviorSubject, Observable } from 'rxjs';
import { NoopComponent, NoopModule } from '../../utils/noop.module';
import { BreadcrumbsResolver } from './breadcrumbs.resolver';


describe('BreadcrumbsService', () => {
  function createService({ routes = [], providers = [] } = {}) {
    TestBed.configureTestingModule({
      imports: [
        NoopModule,
        RouterTestingModule.withRoutes(routes)
      ],
      providers: [
        BoostBreadcrumbsService,
        ...providers
      ]
    });

    const service: BoostBreadcrumbsService = TestBed.get(BoostBreadcrumbsService);

    return { service };
  }

  it('should be created', () => {
    const { service } = createService();
    expect(service).toBeTruthy();
  });

  describe('updating breadcrumbs$ on NavigationEnd', () => {

    it('should emit 3 breadcrumbs', done => {
      const { service } = createService({
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

      service.breadcrumbs$
        .pipe(
          // BehaviourSubject by default emmits the first value, which in this case is an empty array
          skip(1),
          first()
        )
        .subscribe((crumbs: Breadcrumb[]) => {
          expect(crumbs).toEqual([{
            label: 'First',
            href: '/first'
          }, {
            label: 'Second',
            href: '/first/second'
          }, {
            label: 'Third',
            href: '/first/second/third'
          }]);
          done();
        });
      const router: Router = TestBed.get(Router);

      router.navigateByUrl('/first/second/third');
    });

    it('should skip the second breadcrumb when a route didn\'t provide any data', done => {
      const { service } = createService({
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

      service.breadcrumbs$
        .pipe(
          // BehaviourSubject by default emmits the first value, which in this case is an empty array
          skip(1),
          first()
        )
        .subscribe((crumbs: Breadcrumb[]) => {
          expect(crumbs).toEqual([{
            label: 'First',
            href: '/first'
          }, {
            label: 'Third',
            href: '/first/second/third'
          }]);
          done();
        });
      const router: Router = TestBed.get(Router);

      router.navigateByUrl('/first/second/third');
    });

    it('should get a data from the resolver', done => {
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

      const { service } = createService({
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

      service.breadcrumbs$
        .pipe(
          // BehaviourSubject by default emmits the first value, which in this case is an empty array
          skip(1),
          first()
        )
        .subscribe((crumbs: Breadcrumb[]) => {
          expect(crumbs).toEqual([{
            label: 'First',
            href: '/first'
          }, {
            label: 'overriden-text',
            href: '/overriden-path'
          }, {
            label: 'Third',
            href: '/first/second/third'
          }]);
          done();
        });
      const router: Router = TestBed.get(Router);

      router.navigateByUrl('/first/second/third');

    });

    it('should be possible to inject any classes inside a resolver', done => {
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

      const { service } = createService({
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

      service.breadcrumbs$
        .pipe(
          // BehaviourSubject by default emmits the first value, which in this case is an empty array
          skip(1),
          first()
        )
        .subscribe((crumbs: Breadcrumb[]) => {
          expect(crumbs).toEqual([{
            label: 'First',
            href: '/first'
          }, {
            label: 'translatedName',
            href: '/overriden-path'
          }, {
            label: 'Third',
            href: '/first/second/third'
          }]);
          done();
        });
      const router: Router = TestBed.get(Router);

      router.navigateByUrl('/first/second/third');
    });

    it('should dynamically change the breadcrumb info when resolver returned an observable', done => {
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

      const { service } = createService({
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

      const router: Router = TestBed.get(Router);
      router.navigateByUrl('/first');


      const expected: Breadcrumb[][] = [
        [],
        [{
          label: 'hello',
          href: '/overriden-path'
        }],
        [{
          label: 'world',
          href: '/overriden-path'
        }]
      ];
      service.breadcrumbs$
        .subscribe((it: Breadcrumb[]) => {
          expect(it).toEqual(expected.shift());
          if (expected.length === 0) {
            done();
          }
        });


      const simpleTestResolver: SimpleTestResolver = TestBed.get(SimpleTestResolver);
      setTimeout(() => {
        simpleTestResolver._subject.next('hello');
        simpleTestResolver._subject.next('world');
      });
    });

    it('should dynamically change 2 breadcrumbs info when resolver returned an observable for both of them', done => {
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

      const { service } = createService({
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

      const router: Router = TestBed.get(Router);
      router.navigateByUrl('/first/second');


      const expected: Breadcrumb[][] = [
        [],
        [{
          label: 'Alice',
          href: '/'
        }, {
          label: 'Bob',
          href: '/',
        }],
        [{
          label: 'Alice goes',
          href: '/'
        }, {
          label: 'Bob',
          href: '/'
        }],
        [{
          label: 'Alice goes',
          href: '/'
        }, {
          label: 'Bob goes',
          href: '/'
        }]
      ];
      service.breadcrumbs$
        .subscribe((it: Breadcrumb[]) => {
          expect(it).toEqual(expected.shift());
          if (expected.length === 0) {
            done();
          }
        });


      const resolver1: SimpleTestResolver1 = TestBed.get(SimpleTestResolver1);
      const resolver2: SimpleTestResolver2 = TestBed.get(SimpleTestResolver2);
      setTimeout(() => {
        resolver1._subject.next('Alice');
        resolver2._subject.next('Bob');
        resolver1._subject.next('Alice goes');
        resolver2._subject.next('Bob goes');
      });
    });

    it('should unsibscribe from the resolver when it changes the route', done => {
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

      const { service } = createService({
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

      const router: Router = TestBed.get(Router);
      router.navigateByUrl('/first/second');

      const expected: Breadcrumb[][] = [
        [],
        [{
          label: 'Alice',
          href: '/'
        }, {
          label: 'Bob',
          href: '/',
        }],
        [{
          label: 'Alice',
          href: '/'
        }],
      ];
      service.breadcrumbs$
        .subscribe((it: Breadcrumb[]) => {
          expect(it).toEqual(expected.shift());
        });


      const resolver1: SimpleTestResolver1 = TestBed.get(SimpleTestResolver1);
      const resolver2: SimpleTestResolver2 = TestBed.get(SimpleTestResolver2);
      setTimeout(() => {
        resolver1._subject.next('Alice');
        resolver2._subject.next('Bob');
        router.navigateByUrl('/first');
        setTimeout(() => {
          expect(resolver1._subject.observers.length).toEqual(1);
          expect(resolver2._subject.observers.length).toEqual(0);
          done();
        });
      });
    });

  });
});
