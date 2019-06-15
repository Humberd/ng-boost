import { Observable, of, OperatorFunction, pipe, Subject, Subscription, timer } from 'rxjs';
import { catchError, delay, flatMap, switchMap, tap } from 'rxjs/operators';

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

export class AutorefreshConsumerImpl implements AutorefreshConsumer {
  private fetchEmitter$ = new Subject();
  private subscription: Subscription;

  constructor(private config: AutorefreshConfig) {

  }

  start(): void {
    this.stop();

    this.subscription = this.fetchEmitter$
      .pipe(this.getRefreshPipe())
      .subscribe();

    this.fetch();
  }

  private getRefreshPipe(): OperatorFunction<any, any> {
    if (this.config.mode === AutorefreshMode.CONSTANT) {
      return pipe(
        switchMap(() => timer(0, this.config.period)),
        flatMap(() => this.config.source()
          .pipe(
            catchError(err => of(err))
          )
        )
      );
    }

    if (this.config.mode === AutorefreshMode.SOURCE_DEPENDANT) {
      return pipe(
        switchMap(() => this.config.source()
          .pipe(
            catchError(err => of(err)),
            delay(this.config.period),
            tap(() => this.fetch())
          )
        ),
      );
    }

    throw Error('Not implemented');
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
