import { Inject, Injectable, InjectionToken, Injector, OnDestroy } from '@angular/core';
import { Destroy$ } from '../../utils/destroy';
import { from, Observable, Subject } from 'rxjs';
import { ActivatedRouteSnapshot, NavigationEnd, Router } from '@angular/router';
import { RouterUtilsService } from '../../utils/router-utils.service';
import { defaultIfEmpty, filter, flatMap, switchMap, take, takeUntil } from 'rxjs/operators';
import { reemitWhen } from '../../utils/rxjs';
import { Title } from '@angular/platform-browser';
import { TitleRouteResolver } from './title.route.resolver';
import { TitleMainResolver } from './title.main.resolver';
import { EMPTY_TITLE, ROUTE_DATA_FIELD_NAME } from '../_models/fields';

export const BOOST_TITLE_CONFIG_TOKEN = new InjectionToken<BoostTitleConfig>('Boost Title Config');

export interface BoostTitleConfig {
  mainTitle: string;
}

@Injectable()
export class BoostTitleService implements OnDestroy {
  static readonly EMPTY_TITLE = EMPTY_TITLE;
  static readonly ROUTE_DATA_FIELD_NAME = ROUTE_DATA_FIELD_NAME;

  @Destroy$() private readonly destroy$ = new Subject();
  private readonly refresh$ = new Subject();

  private readonly initialTitle: string;

  constructor(private router: Router,
              private injector: Injector,
              private routerUtils: RouterUtilsService,
              private defaultResolver: TitleRouteResolver,
              private titleService: Title,
              private titleMainResolver: TitleMainResolver,
              @Inject(BOOST_TITLE_CONFIG_TOKEN) private config: BoostTitleConfig
  ) {
    this.initialTitle = this.titleService.getTitle();

    this.router.events
      .pipe(
        takeUntil(this.destroy$),
        filter(it => it instanceof NavigationEnd),
        reemitWhen(this.refresh$),
        switchMap(() => this._resolveTitle())
      )
      .subscribe(title => {
        this.titleService.setTitle(this.titleMainResolver.resolve(title, this.config.mainTitle));
      });
  }

  ngOnDestroy(): void {
    console.log('DESTROY BoostTitleService');
    this.titleService.setTitle(this.initialTitle);
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
