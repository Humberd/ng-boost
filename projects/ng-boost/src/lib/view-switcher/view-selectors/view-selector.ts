import { Injectable, OnInit, Optional, TemplateRef, ViewContainerRef } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AvailableViewType } from '../_models/view-switcher.model';
import { BoostViewSwitcherService, PotentialViewSwitcherService } from '../_services/boost-view-switcher.service';
import { Destroy$ } from '../../utils/destroy';

@Injectable()
export abstract class BoostViewSelector implements OnInit {
  @Destroy$() private readonly destroy$ = new Subject();

  abstract viewType: AvailableViewType;

  constructor(private readonly templateRef: TemplateRef<any>,
              private readonly viewRef: ViewContainerRef,
              private readonly viewTypesService: BoostViewSwitcherService,
              @Optional() private potentialViewSwitcherService: PotentialViewSwitcherService) {
    console.log(potentialViewSwitcherService);
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
