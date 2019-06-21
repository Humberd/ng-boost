import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExampleTableComponent } from './example-table/example-table.component';
import { MatButtonModule, MatCardModule, MatIconModule, MatListModule, MatTableModule, MatTreeModule } from '@angular/material';
import { ExampleGridComponent } from './example-grid/example-grid.component';
import { ExampleTreeComponent } from './example-tree/example-tree.component';
import { ExampleListComponent } from './example-list/example-list.component';

@NgModule({
  declarations: [ExampleTableComponent, ExampleGridComponent, ExampleTreeComponent, ExampleListComponent],
  imports: [
    CommonModule,
    MatTableModule,
    MatCardModule,
    MatButtonModule,
    MatTreeModule,
    MatIconModule,
    MatListModule
  ],
  exports: [ExampleTableComponent, ExampleGridComponent, ExampleTreeComponent, ExampleListComponent]
})
export class SharedModule { }
