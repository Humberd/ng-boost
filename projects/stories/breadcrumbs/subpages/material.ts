import { IApi, moduleMetadata } from '@storybook/angular';
import { Component } from '@angular/core';
import { BoostBreadcrumbsService } from '@ng-boost/core';

console.log(BoostBreadcrumbsService);

@Component({
  template: `
    foobar
  `
})
class MaterialComponent {

}


export default (api: IApi) => {
  api
    .addDecorator(moduleMetadata({
      imports: []
    }))
    .add('Material', () => ({
      component: MaterialComponent
    }));
}
