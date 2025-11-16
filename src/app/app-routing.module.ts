import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PageComponent } from './page/page/page.component';
import { AuthGuard } from './shared/guards/auth.guard';
import { StatComponent } from './page/stat/stat.component';

const routes: Routes = [
  {
    path: 'stat',
    component: StatComponent,
    canActivate: [AuthGuard],
  },
  {
    path: '',
    component: PageComponent,
    canActivate: [AuthGuard],
  },
  {
    path: '**',
    redirectTo: '',
    canActivate: [AuthGuard],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
