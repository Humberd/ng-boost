import { Component } from '@angular/core';
import { localViewSwitcher } from 'ng-boost';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  viewProviders: [
    localViewSwitcher({
      storageKey: 'foobar321',
    })
  ]
})
export class AppComponent {
}

