import { Directive, Input, OnInit } from '@angular/core';
import { MatMenu, MatMenuTrigger } from '@angular/material/menu';
import { OverlayConfig, OverlayRef } from '@angular/cdk/overlay';
import { delayWhen, map, switchMap, takeUntil, tap } from 'rxjs/operators';
import { fromEvent, Subject } from 'rxjs';
import { Destroy$ } from '@ng-boost/core';

@Directive({
  selector: `[boostMatContextMenuTriggerFor]`,
  host: {
    '(contextmenu)': '_handleClick($event, true)',
  },
  exportAs: 'boostMatContextMenuTriggerFor',
})
// @ts-ignore
export class BoostMatContextMenuTriggerForDirective extends MatMenuTrigger implements OnInit {
  @Destroy$() private readonly destroy$ = new Subject();

  @Input('boostMatContextMenuTriggerFor')
  set trigger(menu: MatMenu) {
    this.menu = menu;
  }

  @Input() contextMenuDisabled = false;

  private currentClickCoords: { x: number, y: number } = {
    x: 0,
    y: 0,
  };

  ngOnInit(): void {
    this.menuOpened
      .pipe(
        switchMap(() => {
          // @ts-ignore
          const overlayRef: OverlayRef = this._overlayRef;
          return fromEvent(overlayRef.backdropElement, 'contextmenu');
        }),
        map((event: MouseEvent) => {
          // don't show context menu on the backdrop
          event.preventDefault();
          this.closeMenu();

          const elementUnderBackdropToPropagateTheEventTo = document.elementFromPoint(event.clientX, event.clientY);
          if (!elementUnderBackdropToPropagateTheEventTo) {

            throw Error('elem not found');
          }

          const clonedEvent = new MouseEvent('contextmenu', event);

          return {target: elementUnderBackdropToPropagateTheEventTo, event: clonedEvent};
        }),
        /* We have to wait until the existing closing menu animation ends, otherwise
        *  we have some animation glitches. */
        delayWhen(() => (this.menu as MatMenu)._animationDone),
        tap(({event, target}) => target.dispatchEvent(event)),
        takeUntil(this.destroy$),
      )
      .subscribe();
  }

  _handleClick(event: MouseEvent, wasContextMenu?: boolean): void {
    if (!wasContextMenu) {
      return;
    }

    if (this.contextMenuDisabled) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();
    this.currentClickCoords.x = event.x;
    this.currentClickCoords.y = event.y;
    super._handleClick(event);
  }

  private _getOverlayConfig(): OverlayConfig {
    return new OverlayConfig({
      // @ts-ignore
      positionStrategy: this._overlay.position()
        .flexibleConnectedTo(this.currentClickCoords)
        .withLockedPosition()
        .withTransformOriginOn('.mat-menu-panel, .mat-mdc-menu-panel'),
      backdropClass: this.menu.backdropClass || 'cdk-overlay-transparent-backdrop',
      // @ts-ignore
      scrollStrategy: this._scrollStrategy(),
      // @ts-ignore
      direction: this._dir,
    });
  }

}
