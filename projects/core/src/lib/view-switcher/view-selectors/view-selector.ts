import { Inject, OnInit, TemplateRef, ViewContainerRef } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AvailableViewType } from '../_models/view-switcher.model';
import { BoostViewSwitcherService } from '../_services/boost-view-switcher.service';
import { Destroy$ } from '../../utils/destroy';

export abstract class BoostViewSelector implements OnInit {
  @Destroy$() private readonly destroy$ = new Subject();

  abstract viewType: AvailableViewType;

  constructor(
    @Inject(TemplateRef) private readonly templateRef: TemplateRef<any>,
    @Inject(ViewContainerRef) private readonly viewRef: ViewContainerRef,
    @Inject(BoostViewSwitcherService) private readonly viewTypesService: BoostViewSwitcherService,
  ) {
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

}
