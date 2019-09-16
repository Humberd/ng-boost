import { ChangeDetectionStrategy, Component, Input, ViewEncapsulation } from '@angular/core';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'boost-mat-icon',
  template: `
    <ng-content></ng-content>`,
  // tslint:disable-next-line:no-host-metadata-property
  host: {
    role: 'img',
    class: 'app-icon',
    '[class.app-icon-inline]': 'inline',
  },
  styleUrls: ['./icon.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BoostMatIconComponent extends MatIcon {
  @Input() svgIcon: string;
}
