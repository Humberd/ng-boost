import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExampleTableComponent } from './example-table/example-table.component';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatTableModule } from '@angular/material/table';
import { MatTreeModule } from '@angular/material/tree';
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
