import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExampleTableComponent } from './example-table/example-table.component';
import { MatTableModule } from '@angular/material';

@NgModule({
  declarations: [ExampleTableComponent],
  imports: [
    CommonModule,
    MatTableModule
  ],
  exports: [ExampleTableComponent]
})
export class SharedModule { }
