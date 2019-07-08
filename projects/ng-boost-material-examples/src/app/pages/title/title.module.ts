import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { TitleComponent } from './title.component';
import { GroupsComponent } from './groups/groups.component';
import { UsersComponent } from './users/users.component';
import { BoostTitleModule } from '@ng-boost/core';
import { MatButtonModule, MatIconModule } from '@angular/material';
import { SharedModule } from '../../shared/shared.module';

const routes: Routes = [{
  path: '',
  component: TitleComponent,
  children: [
    {
      path: 'users',
      component: UsersComponent,
      data: {
        title: 'Users'
      }
    },
    {
      path: 'groups',
      component: GroupsComponent,
      data: {
        title: 'Groups'
      }
    }
  ]
}];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    BoostTitleModule.forRoot(),
    MatButtonModule,
    SharedModule,
    MatIconModule
  ],
  declarations: [
    TitleComponent,
    GroupsComponent,
    UsersComponent
  ]
})
export class TitleModule {
}
