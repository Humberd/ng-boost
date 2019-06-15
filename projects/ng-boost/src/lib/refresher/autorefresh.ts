import { Observable, of, Subject, Subscription, timer } from 'rxjs';
import { catchError, flatMap, switchMap } from 'rxjs/operators';

export interface AutorefreshConsumer {
  fetch(): void;

  stop(): void;
}

export interface AutorefreshConfig {
  source: () => Observable<any>;
  period: number; // in milliseconds
  mode: AutorefreshMode;
}

export enum AutorefreshMode {
  CONSTANT, // constant refreshing every x seconds
  SOURCE_DEPENDANT // starts a new countdown only after surce emits a value
}

export class AutorefreshConsumerImpl<T> implements AutorefreshConsumer {
  private fetchEmitter$ = new Subject();
  private subscription: Subscription;

  constructor(private config: AutorefreshConfig) {

  }

  start(): void {
    this.stop();

    this.subscription = this.fetchEmitter$
      .pipe(
        switchMap(() => timer(0, this.config.period)),
        flatMap(() => this.config.source()
          .pipe(
            catchError(err => of(err))
          )
        )
      )
      .subscribe();

    this.fetch();
  }

  fetch(): void {
    this.fetchEmitter$.next();
  }

  stop(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

}

export function autorefresh<T>(config: AutorefreshConfig): AutorefreshConsumer {
  const consumer = new AutorefreshConsumerImpl(config);
  consumer.start();

  return consumer;
}
