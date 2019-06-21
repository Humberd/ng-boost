import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExampleTableComponent } from './example-table/example-table.component';
import { MatButtonModule, MatCardModule, MatTableModule } from '@angular/material';
import { ExampleGridComponent } from './example-grid/example-grid.component';

@NgModule({
  declarations: [ExampleTableComponent, ExampleGridComponent],
  imports: [
    CommonModule,
    MatTableModule,
    MatCardModule,
    MatButtonModule
  ],
  exports: [ExampleTableComponent, ExampleGridComponent]
})
export class SharedModule { }
