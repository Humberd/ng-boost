import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export abstract class TitleMainResolver {

  abstract resolve(routeTitle: string, mainTitle: string): Observable<string> | Promise<string> | string;

}

@Injectable()
export class DefaultTitleMainResolver extends TitleMainResolver {

  resolve(routeTitle: string, mainTitle: string): Observable<string> | Promise<string> | string {
    if (!routeTitle) {
      return mainTitle;
    } else {
      return `${routeTitle} - ${mainTitle}`;
    }
  }

}



