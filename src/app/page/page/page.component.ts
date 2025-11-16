import { Component, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { logoutAction } from 'src/app/auth/store/actions/logout.action';
import { currentUserSelector } from 'src/app/auth/store/selectors';
import { Observable, first, lastValueFrom } from 'rxjs';
import { apiKeysSelector, botStatusSelector } from '../store/selectors';
import { BotStatus } from 'src/app/shared/types/commonInterfaces';
import { CurrentUserApi } from '../types/userInfo.interface';
import { markets } from 'src/app/shared/rConst';
import { deleteApiAction } from '../store/actions/deleteApi.action';
import { adminGuard } from 'src/app/shared/guards/admin.guard';
import { CurrentUserTokenResponseInterface } from 'src/app/shared/types/currentUserTokenResponse.interface';
import { PersistanceService } from 'src/app/shared/services/persistance.service';
import { ActivatedRoute, Router } from '@angular/router';
import { UserRole } from 'src/app/shared/types/userRole.enum';

@Component({
  selector: 'app-page',
  templateUrl: './page.component.html',
  styleUrls: ['./page.component.scss'],
})
export class PageComponent implements OnInit {
  user$: Observable<CurrentUserTokenResponseInterface | null>;
  apiKeys$: Observable<CurrentUserApi[]>;
  isApiCreated: boolean = false;
  email: string;
  isAdmin: boolean = false;
  accountId: string;
  token: string;
  apiArray: CurrentUserApi[] = [];
  isOpen: boolean = false;
  botStatus: BotStatus;
  botStatuses: typeof BotStatus = BotStatus;
  isEdit: boolean = false;
  isAddEmail: boolean = false;
  isRefInfo: boolean = false;
  editApiInfo: CurrentUserApi | null = null;
  refLink: string | null = null;
  constructor(private store: Store, private persService: PersistanceService) {}

  ngOnInit(): void {
    this.initializeValues();
    this.subscribe();
  }

  initializeValues() {
    this.user$ = this.store.pipe(select(currentUserSelector));
    this.apiKeys$ = this.store.pipe(select(apiKeysSelector));
  }

  subscribe() {
    this.user$.pipe(first()).subscribe(async (user) => {
      this.email = user?.email || '';
      this.token = user?.refreshToken || '';
      this.isAdmin = user
        ? user.userRole === UserRole.Admin ||
          user.userRole === UserRole.SuperAdmin
        : false;
      this.accountId = user?.tgAccount || '';
      if (this.accountId) {
        this.refLink = `https://arthem.pro/?refId=${this.accountId}`;
      }
      if (this.isTgEmail()) {
        this.isAddEmail = !this.persService.get('isAddEmail');
      }
    });
    this.apiKeys$.subscribe((keys) => {
      this.apiArray = keys.map((key) => ({
        ...key,
        market: markets.find((m) => m.val === key.market)?.name || '',
      }));
    });
  }

  logout() {
    this.store.dispatch(logoutAction());
  }

  removeApi(api: CurrentUserApi) {
    this.store.dispatch(deleteApiAction({ email: this.email, apiId: api.id }));
  }

  editApi(api: CurrentUserApi | null) {
    this.editApiInfo = api;
    this.isEdit = true;
  }

  isTgEmail() {
    return this.email.includes('@tg.login');
  }

  addEmailToTg() {
    this.isAddEmail = true;
  }

  closeEmailForm() {
    this.isAddEmail = false;
  }

  showAddApi() {
    this.isEdit = true;
    this.editApiInfo = null;
  }
  closeApiForm() {
    this.isEdit = false;
    this.editApiInfo = null;
  }

  showRefInfo() {
    this.isRefInfo = true;
  }

  // getStatusText(api: CurrentUserApi) {
  //   if (api.status === 'Запущен') {
  //     return `${api.status}: ${api.startedBotLongCount}; ${api.startedBotShortCount}`;
  //   } else {
  //     return api.status;
  //   }
  // }
}
