import { fakeAsync, TestBed, tick } from '@angular/core/testing';

import { RouterUtilsService } from './router-utils.service';
import { NoopComponent, NoopModule } from './noop.module';
import { RouterTestingModule } from '@angular/router/testing';
import { Router, Routes } from '@angular/router';
import { NgZone } from '@angular/core';

describe('RouterUtilsService', () => {

  function initiateModule(routes: Routes) {
    TestBed.configureTestingModule({
      providers: [
        RouterUtilsService,
      ],
      imports: [
        NoopModule,
        RouterTestingModule.withRoutes(routes),
      ],
    }).compileComponents();

    const router = TestBed.get(Router);
    const service = TestBed.get(RouterUtilsService);
    const ngZone = TestBed.get(NgZone);

    return {router, service, ngZone};
  }

  describe('param', () => {
    let service: RouterUtilsService;
    let router: Router;
    let ngZone: NgZone;

    beforeEach(() => {
      const services = initiateModule([
        {
          path: 'sites',
          children: [
            {
              path: ':siteId',
              component: NoopComponent,
            },
          ],
        },
        {
          path: 'sla',
          children: [
            {
              path: ':slaId',
              children: [
                {
                  path: 'details',
                  component: NoopComponent,
                },
              ],
            },
          ],
        },
      ]);

      router = services.router;
      service = services.service;
      ngZone = services.ngZone;
    });

    function goTo(url: string) {
      ngZone.run(() => {
        router.navigateByUrl(url);
      });
      tick(0);
    }

    describe('getParam', () => {

      it('should get desired params', fakeAsync(() => {
        goTo('/sla/abc');
        expect(service.getParam('slaId')).toBe('abc');

        goTo('/sites/xyz');
        expect(service.getParam('siteId')).toBe('xyz');

        goTo('/sla/456/details');
        expect(service.getParam('slaId')).toBe('456');
      }));

      it('should return undefined for not existing parameters', fakeAsync(() => {
        goTo('/sla/abc');
        expect(service.getParam('notExistingId')).toBe(undefined);

        goTo('/sites');
        expect(service.getParam('siteId')).toBe(undefined);
      }));
    });

    describe('watchParam', () => {
      it('should emit paramId when route changes after going to a route with param', fakeAsync(() => {
        goTo('/sites/1234');

        let currentSideId: string;
        service.watchParam('siteId')
          .subscribe(siteId => currentSideId = siteId);

        expect(currentSideId).toBe('1234');

        goTo('/sites/my-new-site-id');
        expect(currentSideId).toBe('my-new-site-id');

        goTo('/sla/some-sla-id');
        expect(currentSideId).toBe(undefined);

        goTo('/sites/5667');
        expect(currentSideId).toBe('5667');
      }));

      it('should emit paramId when route changes before going to a route with param', fakeAsync(() => {
        let currentSideId: string;
        service.watchParam('siteId')
          .subscribe(siteId => currentSideId = siteId);

        goTo('/sites/1234');
        expect(currentSideId).toBe('1234');

        goTo('/sites/my-new-site-id');
        expect(currentSideId).toBe('my-new-site-id');

        goTo('/sla/some-sla-id');
        expect(currentSideId).toBe(undefined);

        goTo('/sites/5667');
        expect(currentSideId).toBe('5667');
      }));
    });
  });

  describe('queryParam', () => {
    let service: RouterUtilsService;
    let router: Router;
    let ngZone: NgZone;

    beforeEach(() => {
      const services = initiateModule([
        {
          path: 'sites',
          children: [
            {
              path: ':siteId',
              component: NoopComponent,
            },
          ],
        },
        {
          path: 'sla',
          children: [
            {
              path: ':slaId',
              children: [
                {
                  path: 'details',
                  component: NoopComponent,
                },
              ],
            },
          ],
        },
      ]);

      router = services.router;
      service = services.service;
      ngZone = services.ngZone;
    });

    function goTo(url: string) {
      ngZone.run(() => {
        router.navigateByUrl(url);
      });
      tick(0);
    }

    describe('getQueryParam', () => {

      it('should get desired query params', fakeAsync(() => {
        goTo('/sla/abc?filterBy=name');
        expect(service.getQueryParam('filterBy')).toBe('name');

        goTo('/sites/xyz?filterBy=age');
        expect(service.getQueryParam('filterBy')).toBe('age');

        goTo('/sla/456/details?sortBy=home');
        expect(service.getQueryParam('sortBy')).toBe('home');
      }));

      it('should return undefined for not existing parameters', fakeAsync(() => {
        goTo('/sla/abc?filterBy=name');
        expect(service.getQueryParam('sortBy')).toBe(undefined);

        goTo('/sites?getAll=true');
        expect(service.getQueryParam('filterBy')).toBe(undefined);
      }));
    });

    describe('watchQueryParam', () => {
      it('should emit queryParam when route changes after going to a route with queryParam', fakeAsync(() => {
        goTo('/sites/1234?filterBy=name');

        let currentFilterBy: string;
        service.watchQueryParam('filterBy')
          .subscribe(filterBy => currentFilterBy = filterBy);

        expect(currentFilterBy).toBe('name');

        goTo('/sites/1234?filterBy=age');
        expect(currentFilterBy).toBe('age');

        goTo('/sites/new-site?filterBy=salary');
        expect(currentFilterBy).toBe('salary');

        goTo('/sla/some-sla-id');
        expect(currentFilterBy).toBe(undefined);

        goTo('/sites/5667?filterBy=job');
        expect(currentFilterBy).toBe('job');
      }));

      it('should emit paramId when route changes before going to a route with param', fakeAsync(() => {
        let currentFilterBy: string;
        service.watchQueryParam('filterBy')
          .subscribe(filterBy => currentFilterBy = filterBy);

        goTo('/sites/1234?filterBy=name');
        expect(currentFilterBy).toBe('name');

        goTo('/sites/1234?filterBy=age');
        expect(currentFilterBy).toBe('age');

        goTo('/sites/new-site?filterBy=salary');
        expect(currentFilterBy).toBe('salary');

        goTo('/sla/some-sla-id');
        expect(currentFilterBy).toBe(undefined);

        goTo('/sites/5667?filterBy=job');
        expect(currentFilterBy).toBe('job');
      }));
    });
  });


  describe('getCurrentRoutesChain', () => {
    let service: RouterUtilsService;
    let router: Router;
    let ngZone: NgZone;

    beforeEach(() => {
      const services = initiateModule([
        {
          path: 'sites',
          children: [
            {
              path: ':siteId',
              component: NoopComponent,
            },
          ],
        },
        {
          path: 'sla',
          children: [
            {
              path: ':slaId',
              children: [
                {
                  path: 'details',
                  component: NoopComponent,
                },
              ],
            },
          ],
        },
      ]);

      router = services.router;
      service = services.service;
      ngZone = services.ngZone;
    });

    it('should get routes chain', fakeAsync(() => {
      ngZone.run(() => {
        router.navigateByUrl('/sla');
      });
      tick(0);
      expect(service.getCurrentRoutesChain().length).toBe(2);

      ngZone.run(() => {
        router.navigateByUrl('/sites/1234');
      });
      tick(0);
      expect(service.getCurrentRoutesChain().length).toBe(3);

      ngZone.run(() => {
        router.navigateByUrl('/sla/qwerty/details');
      });
      tick(0);
      expect(service.getCurrentRoutesChain().length).toBe(4);
    }));
  });

});
