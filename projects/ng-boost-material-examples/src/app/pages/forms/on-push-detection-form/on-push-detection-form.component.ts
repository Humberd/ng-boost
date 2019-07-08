import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControllerConfig, FormRootController } from '@ng-boost/core';
import { Observable, of } from 'rxjs';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { OnPushBadgesFormValues } from './on-push-badges/on-push-badges.component';

interface OnPushDetectionFormValues {
  name: string;
  age: string;
  badgesForm: OnPushBadgesFormValues;
}

@Component({
  selector: 'app-on-push-detection-form',
  templateUrl: './on-push-detection-form.component.html',
  styleUrls: ['./on-push-detection-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OnPushDetectionFormComponent extends FormRootController<OnPushDetectionFormValues> {
  getFormDefinition(): FormControllerConfig<OnPushDetectionFormValues> {
    return {
      name: new FormControl('Paul', Validators.required),
      age: new FormControl(null, Validators.required),
      badgesForm: new FormGroup({})
    };
  }

  protected submitAction(values: OnPushDetectionFormValues): Observable<any> {
    console.log(values);
    return of(values);
  }

}
