import { Injectable } from '@angular/core';

export abstract class TitleMainResolver {

  abstract resolve(routeTitle: string, mainTitle: string): string;

}

@Injectable()
export class DefaultTitleMainResolver extends TitleMainResolver {

  resolve(routeTitle: string, mainTitle: string): string {
    if (!routeTitle) {
      return mainTitle;
    } else {
      return `${routeTitle} - ${mainTitle}`;
    }
  }

}



