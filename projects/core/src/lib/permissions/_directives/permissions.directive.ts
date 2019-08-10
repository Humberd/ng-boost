import { ChangeDetectorRef, Directive, Input, OnInit, TemplateRef, ViewContainerRef } from '@angular/core';
import { BoostPermissionsService, PermissionInput } from '../_services/boost-permissions.service';
import { Destroy$ } from '../../utils/destroy';
import { BehaviorSubject, Subject } from 'rxjs';
import { map, skip, takeUntil } from 'rxjs/operators';
import { reemitWhen } from '../../utils/rxjs';

@Directive({
  selector: '[boostPermissions]'
})
export class PermissionsDirective implements OnInit {
  @Destroy$() private readonly destroy$ = new Subject();

  private boostPermissions$ = new BehaviorSubject<PermissionInput>(undefined);

  @Input()
  set boostPermissions(value: PermissionInput) {
    this.boostPermissions$.next(value);
  }

  @Input() boostPermissionsThen: TemplateRef<any>;
  @Input() boostPermissionsElse: TemplateRef<any>;

  private currentViewTemplate?: TemplateRef<any> = undefined;

  constructor(
    private templateRef: TemplateRef<any>,
    private permissionsService: BoostPermissionsService,
    private cdr: ChangeDetectorRef,
    private viewContainerRef: ViewContainerRef
  ) {
  }

  ngOnInit(): void {
    this.permissionsService.permissions$
      .pipe(
        takeUntil(this.destroy$),
        reemitWhen(this.boostPermissions$.pipe(skip(1))),
        map(() => this.permissionsService.hasPermissions(this.boostPermissions$.value))
      )
      .subscribe((hasPermissions) => this.applyViewTemplates(hasPermissions));
  }

  private applyViewTemplates(hasPermissions: boolean) {
    if (!hasPermissions) {
      this.embedView(this.boostPermissionsElse);
      return;
    }

    this.embedView(this.boostPermissionsThen || this.templateRef);
  }

  private embedView(templateRef?: TemplateRef<any>) {
    if (this.currentViewTemplate === templateRef) {
      return;
    }

    this.currentViewTemplate = templateRef;
    this.viewContainerRef.clear();

    if (templateRef) {
      this.viewContainerRef.createEmbeddedView(templateRef);
    }

    this.cdr.markForCheck();
  }

}
