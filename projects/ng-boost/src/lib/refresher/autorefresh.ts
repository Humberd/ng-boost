import { Observable, of, Subject, Subscription, timer } from 'rxjs';
import { catchError, flatMap, switchMap } from 'rxjs/operators';

export interface AutorefreshConsumer {
  fetch(): void;

  unsubscribe(): void;
}

export class AutorefreshConsumerImpl<T> implements AutorefreshConsumer {
  private fetchEmitter$ = new Subject();
  private subscription: Subscription;

  constructor(private obs: () => Observable<T>,
              private period: number) {
  }

  start(): void {
    this.subscription = this.fetchEmitter$
      .pipe(
        switchMap(() => timer(0, this.period)),
        flatMap(() => this.obs()
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

  unsubscribe(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

}

export function autorefresh<T>(obs: () => Observable<T>, period: number): AutorefreshConsumer {
  const consumer = new AutorefreshConsumerImpl(obs, period);
  consumer.start();

  return consumer;
}
