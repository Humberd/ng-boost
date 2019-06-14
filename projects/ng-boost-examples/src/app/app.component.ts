import { Component } from '@angular/core';
import { ViewSwitcherService } from 'ng-boost';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  viewProviders: [
    ViewSwitcherService.configure({
      storageKey: 'appComponent'
    })
  ]
})
export class AppComponent {
}

