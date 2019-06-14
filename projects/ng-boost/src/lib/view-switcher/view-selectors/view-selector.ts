import { Injectable, OnDestroy, OnInit, TemplateRef, ViewContainerRef } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AvailableViewType, ViewSwitcherService } from '../_services/view-switcher.service';

@Injectable()
export abstract class ViewSelector implements OnInit, OnDestroy {
  private readonly destroy$ = new Subject();

  abstract viewType: AvailableViewType;

  constructor(private readonly templateRef: TemplateRef<any>,
              private readonly viewRef: ViewContainerRef,
              private readonly viewTypesService: ViewSwitcherService) {
  }

  ngOnInit(): void {
    this.viewTypesService.selectedView$
      .pipe(takeUntil(this.destroy$))
      .subscribe(selectedView => {
        if (selectedView === this.viewType) {
          this.viewRef.createEmbeddedView(this.templateRef);
        } else {
          this.viewRef.clear();
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
  }


}
