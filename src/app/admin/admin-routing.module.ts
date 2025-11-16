import { NgModule } from '@angular/core';
import {
  Routes,
  RouterModule,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';
import { adminGuard } from '../shared/guards/admin.guard';
import { BotsComponent } from './pages/bots/bots.component';
import { MainComponent } from './pages/main/main.component';
import { ApiTableComponent } from './pages/api-table/api-table.component';
import { StatisticsComponent } from './pages/statistics/statistics.component';
import { WalletsComponent } from './pages/wallets/wallets.component';
import { UsersComponent } from './pages/users/users.component';
import { PartnersComponent } from './pages/partners/partners.component';
import { PromocodesComponent } from './pages/promocodes/promocodes.component';
import { PromoHistoryComponent } from './pages/promo-history/promo-history.component';
import { SettingsComponent } from './pages/settings/settings.component';
import { superAdminGuard } from '../shared/guards/superAdmin.guard';

const routes: Routes = [
  {
    path: 'admin',
    component: MainComponent,
    canActivate: [
      (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) =>
        adminGuard(route, state),
    ],
    children: [
      {
        path: '',
        redirectTo: 'api-table',
        pathMatch: 'full',
      },
      {
        path: 'api-table',
        component: ApiTableComponent,
        canActivate: [
          (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) =>
            adminGuard(route, state),
        ],
      },
      {
        path: 'bots',
        component: BotsComponent,
        canActivate: [
          (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) =>
            superAdminGuard(route, state),
        ],
      },
      {
        path: 'partners',
        component: PartnersComponent,
        canActivate: [
          (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) =>
            superAdminGuard(route, state),
        ],
      },
      {
        path: 'promocodes',
        component: PromocodesComponent,
        canActivate: [
          (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) =>
            adminGuard(route, state),
        ],
      },
      {
        path: 'promo-history',
        component: PromoHistoryComponent,
        canActivate: [
          (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) =>
            adminGuard(route, state),
        ],
      },
      {
        path: 'statistics',
        component: StatisticsComponent,
        canActivate: [
          (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) =>
            adminGuard(route, state),
        ],
      },
      {
        path: 'wallets',
        component: WalletsComponent,
        canActivate: [
          (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) =>
            adminGuard(route, state),
        ],
      },
      {
        path: 'users',
        component: UsersComponent,
        canActivate: [
          (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) =>
            adminGuard(route, state),
        ],
      },
      {
        path: 'settings',
        component: SettingsComponent,
        canActivate: [
          (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) =>
            adminGuard(route, state),
        ],
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminRoutingModule {}
