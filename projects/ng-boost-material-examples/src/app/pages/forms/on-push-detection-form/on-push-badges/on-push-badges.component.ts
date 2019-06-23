import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormController, FormControllerConfig } from 'ng-boost';
import { FormControl, Validators } from '@angular/forms';

export interface Fruit {
  name: string;
}

export interface OnPushBadgesFormValues {
  badges: string;
}

@Component({
  selector: 'app-on-push-badges',
  templateUrl: './on-push-badges.component.html',
  styleUrls: ['./on-push-badges.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OnPushBadgesComponent extends FormController<OnPushBadgesFormValues> {
  getFormDefinition(): FormControllerConfig<OnPushBadgesFormValues> {
    return {
      badges: new FormControl('', Validators.required)
    };
  }
}
