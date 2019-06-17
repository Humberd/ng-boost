import { Injectable, Injector } from '@angular/core';
import { Destroy$ } from '../../utils/destroy';
import { from, Observable, Subject } from 'rxjs';
import { ActivatedRouteSnapshot, NavigationEnd, Router } from '@angular/router';
import { RouterUtilsService } from '../../utils/router-utils.service';
import { defaultIfEmpty, filter, flatMap, switchMap, take, takeUntil } from 'rxjs/operators';
import { reemitWhen } from '../../utils/rxjs';
import { Title } from '@angular/platform-browser';
import { TitleDefaultRouteResolver } from './title-default.route.resolver';
import { TitleRouteResolver } from './title.route.resolver';
import { TitleMainResolver } from './title.main.resolver';

@Injectable()
export class BoostTitleService {
  static readonly EMPTY_TITLE = '';
  static readonly ROUTE_DATA_FIELD_NAME = 'title';

  @Destroy$() private readonly destroy$ = new Subject();
  private readonly refresh$ = new Subject();

  constructor(private router: Router,
              private injector: Injector,
              private routerUtils: RouterUtilsService,
              private defaultResolver: TitleDefaultRouteResolver,
              private titleService: Title,
              private titleMainResolver: TitleMainResolver
  ) {
    this.router.events
      .pipe(
        takeUntil(this.destroy$),
        filter(it => it instanceof NavigationEnd),
        reemitWhen(this.refresh$),
        switchMap(() => this._resolveTitle())
      )
      .subscribe(title => {
        this.titleService.setTitle(this.titleMainResolver.resolve(title, 'blblal'));
      });
  }

  refresh() {
    this.refresh$.next();
  }

  private _resolveTitle(): Observable<string> {
    const routesChain = this.routerUtils.getCurrentRoutesChain()
    /* So that while iterating we would get leaf first */
      .reverse();

    return from(routesChain)
      .pipe(
        flatMap(it => this.resolveTitle(it.snapshot)),
        filter(Boolean),
        take(1),
        defaultIfEmpty(BoostTitleService.EMPTY_TITLE)
      );

  }

  private resolveTitle(route: ActivatedRouteSnapshot): Observable<string> {
    return this.routerUtils.resolveRouteData({
      emptyValue: BoostTitleService.EMPTY_TITLE,
      fieldName: BoostTitleService.ROUTE_DATA_FIELD_NAME,
      resolverBaseClass: TitleRouteResolver,
      route,
      defaultResolver: this.defaultResolver
    });
  }
}
