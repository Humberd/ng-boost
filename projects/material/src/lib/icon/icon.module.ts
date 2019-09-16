import { APP_INITIALIZER, InjectionToken, ModuleWithProviders, NgModule } from '@angular/core';
import { APP_BASE_HREF, CommonModule } from '@angular/common';
import { MatIconModule, MatIconRegistry } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { BoostMatIconComponent } from './icon/icon.component';

export interface BoostIconModuleConfig {
  iconPaths: string[];
}

export const BOOST_MAT_ICON_CONFIG_INJECTION_TOKEN = new InjectionToken('Boost Icon Config');


@NgModule({
  imports: [
    CommonModule,
    MatIconModule,
    HttpClientModule,
  ],
  declarations: [
    BoostMatIconComponent
  ],
  exports: [
    BoostMatIconComponent
  ],
})
export class BoostMatIconModule {

  static forRoot(config: BoostIconModuleConfig): ModuleWithProviders {
    return {
      ngModule: BoostMatIconModule,
      providers: [
        {
          provide: APP_INITIALIZER,
          deps: [MatIconRegistry],
          useFactory: preserveSvgViewBox,
          multi: true,
        },
        {
          provide: APP_INITIALIZER,
          deps: [MatIconRegistry, DomSanitizer, APP_BASE_HREF, BOOST_MAT_ICON_CONFIG_INJECTION_TOKEN],
          useFactory: registerIcons,
          multi: true,
        },
        {
          provide: BOOST_MAT_ICON_CONFIG_INJECTION_TOKEN,
          useValue: config,
        },
      ],
    };
  }

}

export function registerIcons(
  matRegistry: MatIconRegistry,
  domSanitizer: DomSanitizer,
  baseHref: string,
  config: BoostIconModuleConfig,
) {
  /**
   * Had to introduce a variable, otherwise there were compilation errors:
   *
   * @see https://github.com/ng-packagr/ng-packagr/issues/696#issuecomment-387114613
   */
  const fun = () => {
    for (const path of config.iconPaths) {
      matRegistry.addSvgIconSet(domSanitizer.bypassSecurityTrustResourceUrl(`${baseHref}/${path}`));
    }
  };
  return fun;
}

/**
 * Angular Material doesn't preserve viewBox attribute when providing custom icons.
 * This is crucial for proper attribute scaling.
 * This function overrides default element registration and readds viewbox.
 *
 * @see https://github.com/angular/material2/issues/5488
 */
export function preserveSvgViewBox(matIconRegistry: MatIconRegistry) {
  /**
   * Had to introduce a variable, otherwise there were compilation errors:
   *
   * @see https://github.com/ng-packagr/ng-packagr/issues/696#issuecomment-387114613
   */
  const fun = () => {
    /* tslint:disable-next-line:no-string-literal */
    const oldToSvgElement = matIconRegistry['_toSvgElement'];

    /* tslint:disable-next-line:no-string-literal */
    matIconRegistry['_toSvgElement'] = (element: Element) => {
      const svg = oldToSvgElement.call(matIconRegistry, element);

      const viewBox = element.getAttribute('viewBox');
      if (viewBox !== null) {
        svg.setAttribute('viewBox', viewBox);
      }
      return svg;
    };
  };
  return fun;
}
