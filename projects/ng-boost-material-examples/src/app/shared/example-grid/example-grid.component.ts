import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-example-grid',
  templateUrl: './example-grid.component.html',
  styleUrls: ['./example-grid.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ExampleGridComponent {
  iterator = [1, 2, 3, 4, 5];
}
