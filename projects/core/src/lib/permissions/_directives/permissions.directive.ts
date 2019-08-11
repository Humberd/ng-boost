import { ChangeDetectorRef, Directive, Input, OnInit, TemplateRef, ViewContainerRef } from '@angular/core';
import { Destroy$ } from '../../utils/destroy';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { switchMap, takeUntil } from 'rxjs/operators';
import { Permission, Role } from '../_services/roles-cache.service';
import { GlobalRoleService } from '../_services/global-role.service';
import { LocalRoleService } from '../_services/local-role.service';

@Directive({
  selector: '[boostPermissions]'
})
export class PermissionsDirective implements OnInit {
  @Destroy$() private readonly destroy$ = new Subject();

  private boostPermissions$ = new BehaviorSubject<Permission[]>(undefined);

  @Input()
  set boostPermissions(value: Permission | Permission[]) {
    this.boostPermissions$.next(Array.isArray(value) ? value : [value]);
  }

  @Input() boostPermissionsThen: TemplateRef<any>;
  @Input() boostPermissionsElse: TemplateRef<any>;


  private forRole$ = new BehaviorSubject<Role>(null);

  @Input()
  set forRole(value: Role) {
    this.forRole$.next(value);
  }

  private currentViewTemplate?: TemplateRef<any> = undefined;

  constructor(
    private templateRef: TemplateRef<any>,
    private globalPermissionsService: GlobalRoleService,
    private localPermissionsService: LocalRoleService,
    private cdr: ChangeDetectorRef,
    private viewContainerRef: ViewContainerRef
  ) {
  }

  ngOnInit(): void {
    this.forRole$
      .pipe(
        takeUntil(this.destroy$),
        switchMap((forRole) => {
            if (forRole === null) {
              return this.hasGlobalPermissions();
            }

            return this.hasLocalPermissions(forRole);
          }
        )
      )
      .subscribe((hasPermissions) => this.applyViewTemplates(hasPermissions));

  }

  private hasGlobalPermissions(): Observable<boolean> {
    return this.boostPermissions$
      .pipe(
        switchMap((permissions) => this.globalPermissionsService.hasPermission(permissions))
      );
  }

  private hasLocalPermissions(forRole: string): Observable<boolean> {
    return this.boostPermissions$
      .pipe(
        switchMap((permissions) => this.localPermissionsService.hasPermission(permissions, forRole))
      );
  }

  private applyViewTemplates(hasPermissions: boolean) {
    console.log({hasPermissions});
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
