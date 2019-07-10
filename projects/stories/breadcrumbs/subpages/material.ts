import { IApi, moduleMetadata } from '@storybook/angular';
import { Component } from '@angular/core';
import { BoostMatBreadcrumbsModule } from '@ng-boost/material';
import { BoostBreadcrumbsModule, NoopComponent, NoopModule } from '@ng-boost/core';
import { RouterModule } from '@angular/router';
import { APP_BASE_HREF } from '@angular/common';

@Component({
  template: `
    hello
    <boost-mat-breadcrumbs></boost-mat-breadcrumbs>
    <router-outlet></router-outlet>
  `
})
class MaterialComponent {

}


export default (api: IApi) => {
  api
    .addDecorator(moduleMetadata({
      imports: [
        BoostMatBreadcrumbsModule,
        BoostBreadcrumbsModule.forRoot(),
        NoopModule
      ],
    }))
    .add('Material', () => ({
      component: MaterialComponent,
      moduleMetadata: {
        declarations: [MaterialComponent],
        imports: [
          RouterModule.forRoot([{
            path: '',
            component: NoopComponent
          }], {useHash: false})
        ],
        providers: [
          {
            provide: APP_BASE_HREF,
            useValue: ''
          }
        ]
      }
    }));
}
