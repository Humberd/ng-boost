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
        RouterUtilsService
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

  describe('getParam', () => {
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
              component: NoopComponent
            }
          ]
        },
        {
          path: 'sla',
          children: [
            {
              path: ':slaId',
              children: [
                {
                  path: 'details',
                  component: NoopComponent
                }
              ]
            }
          ]
        }
      ]);

      router = services.router;
      service = services.service;
      ngZone = services.ngZone;
    });

    it('should get desired params', fakeAsync(() => {
      ngZone.run(() => {
        router.navigateByUrl('/sla/abc');
      });
      tick(0);
      expect(service.getParam('slaId')).toBe('abc');

      ngZone.run(() => {
        router.navigateByUrl('/sites/xyz');
      });
      tick(0);
      expect(service.getParam('siteId')).toBe('xyz');

      ngZone.run(() => {
        router.navigateByUrl('/sla/456/details');
      });
      tick(0);
      expect(service.getParam('slaId')).toBe('456');
    }));

    it('should return null for not existing parameters', fakeAsync(() => {
      ngZone.run(() => {
        router.navigateByUrl('/sla/abc');
      });
      tick(0);
      expect(service.getParam('notExistingId')).toBe(undefined);

      ngZone.run(() => {
        router.navigateByUrl('/sites');
      });
      tick(0);
      expect(service.getParam('siteId')).toBe(undefined);
    }));
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
              component: NoopComponent
            }
          ]
        },
        {
          path: 'sla',
          children: [
            {
              path: ':slaId',
              children: [
                {
                  path: 'details',
                  component: NoopComponent
                }
              ]
            }
          ]
        }
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
