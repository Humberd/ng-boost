import { ChangeDetectorRef, Directive, Input, OnInit } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Destroy$ } from '../utils/destroy';
import { takeUntil } from 'rxjs/operators';

@Directive()
// tslint:disable-next-line:directive-class-suffix
export abstract class InputDataParserController<InputData, OutputData> {
  outputData: OutputData;
  private _data: InputData;

  @Input()
  set data(data: InputData) {
    this._data = data;
    this.outputData = this.parseData(data);
  }

  protected abstract parseData(data: InputData): OutputData;

}

@Directive()
// tslint:disable-next-line:directive-class-suffix
export abstract class StreamDataParserController<InputData, OutputData> implements OnInit {
  @Destroy$() protected readonly destroy$ = new Subject();
  outputData: OutputData;

  /**
   * You HAVE TO provide a {ChangeDetectorRef} when you have set:
   * `changeDetection: ChangeDetectionStrategy.OnPush`
   * Otherwise incoming changes might not be reflected in the view
   *
   * @param cdrefff we don't want to have a naming collision with a child class {ChangeDetectorRef}
   */
  constructor(private cdrefff?: ChangeDetectorRef) {

  }

  ngOnInit(): void {
    this.data$()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        this.outputData = this.parseData(data);
        if (this.cdrefff) {
          this.cdrefff.markForCheck();
        }
      });
  }

  protected abstract data$(): Observable<InputData>;

  protected abstract parseData(data: InputData): OutputData;


}
