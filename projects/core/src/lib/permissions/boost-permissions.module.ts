import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PermissionsDirective } from './_directives/permissions.directive';
import { GlobalRoleService } from './_services/global-role.service';
import { LocalRoleService } from './_services/local-role.service';
import { PermissionsValidatorService } from './_services/permissions-validator.service';
import { RolesCacheService } from './_services/roles-cache.service';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    PermissionsDirective
  ],
  exports: [
    PermissionsDirective
  ]
})
export class BoostPermissionsModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: BoostPermissionsModule,
      providers: [
        GlobalRoleService,
        LocalRoleService,
        PermissionsValidatorService,
        RolesCacheService
      ]
    };
  }
}
