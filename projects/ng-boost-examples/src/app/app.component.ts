import { Component, Injectable } from '@angular/core';
import { ViewSwitcherService } from 'ng-boost';

@Injectable()
export class AViewSwitcherService extends ViewSwitcherService {
  constructor() {
    super({
      storageKey: 'foobar'
    });
  }
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  viewProviders: [
    {
      provide: ViewSwitcherService,
      useClass: AViewSwitcherService
    }
  ]
})
export class AppComponent {
  title = 'ng-boost-examples';
}

