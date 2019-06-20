import { TestBed } from '@angular/core/testing';
import { NoopModule } from '../utils/noop.module';
import { RouterTestingModule } from '@angular/router/testing';
import { NgZone } from '@angular/core';
import { Router } from '@angular/router';

describe('RouteParam', () => {

  function createService({routes = [], providers = []} = {}) {
    TestBed.configureTestingModule({
      imports: [
        NoopModule,
        RouterTestingModule.withRoutes(routes)
      ],
      providers: [
        ...providers
      ]
    });

    const ngZone: NgZone = TestBed.get(NgZone);
    const router: Router = TestBed.get(Router);

    return {ngZone, router};
  }

  describe('foobar', () => {

  });

});
