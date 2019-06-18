import { TestBed } from '@angular/core/testing';

import { RouterUtilsService } from './router-utils.service';
import { NoopComponent, NoopModule } from './noop.module';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { NgZone } from '@angular/core';

describe('RouterUtilsService', () => {

  describe('getParam', () => {
    let service: RouterUtilsService;
    let router: Router;
    let ngZone: NgZone;

    beforeEach(() => {
      TestBed.configureTestingModule({
        providers: [
          RouterUtilsService
        ],
        imports: [
          NoopModule,
          RouterTestingModule.withRoutes([
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
          ]),
        ],
      }).compileComponents();

      router = TestBed.get(Router);
      service = TestBed.get(RouterUtilsService);
      ngZone = TestBed.get(NgZone);
    });

    it('should get desired params', async () => {
      await router.navigateByUrl('/sla/abc');
      expect(service.getParam('slaId')).toBe('abc');

      await router.navigateByUrl('/sites/xyz');
      expect(service.getParam('siteId')).toBe('xyz');

      await router.navigateByUrl('/sla/456/details');
      expect(service.getParam('slaId')).toBe('456');
    });

    it('should return null for not existing parameters', async () => {
      await router.navigateByUrl('/sla/abc');
      expect(service.getParam('notExistingId')).toBe(undefined);

      await router.navigateByUrl('/sites');
      expect(service.getParam('siteId')).toBe(undefined);
    });
  });

  describe('getCurrentRoutesChain', () => {
    let service: RouterUtilsService;
    let router: Router;

    beforeEach(() => {
      TestBed.configureTestingModule({
        providers: [
          RouterUtilsService
        ],
        imports: [
          NoopModule,
          RouterTestingModule.withRoutes([
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
          ])
        ]
      }).compileComponents();

      router = TestBed.get(Router);
      service = TestBed.get(RouterUtilsService);
    });

    it('should get routes chain', async () => {
      await router.navigateByUrl('/sla');
      expect(service.getCurrentRoutesChain().length).toBe(2);

      await router.navigateByUrl('/sites/1234');
      expect(service.getCurrentRoutesChain().length).toBe(3);

      await router.navigateByUrl('/sla/qwerty/details');
      expect(service.getCurrentRoutesChain().length).toBe(4);
    });
  });

});
