import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  AllFullBalance,
  ApiWithEmail,
  CommissionApi,
  CommissionUser,
  PaginationMeta,
  UserCommissions,
  RefLevels,
  RefPercent,
  UserInfo,
} from '../store/types/adminState.interface';
import { Store, select } from '@ngrx/store';
import { currentUserSelector } from 'src/app/auth/store/selectors';
import { deleteApiAction } from 'src/app/page/store/actions/deleteApi.action';
import { fullStopBotAction } from 'src/app/page/store/actions/fullStopBot.action';
import { startBotAction } from 'src/app/page/store/actions/startBot.action';
import { stopBotAction } from 'src/app/page/store/actions/stopBot.action';
import { actualizeBotsByApiAction } from '../store/actions/actualizeBotsByApi.action';
import { updateBotsByApiAction } from '../store/actions/updateBotsByApi.action';
import { getUsersAction } from '../store/actions/users.action';
// @ts-ignore
import * as CryptoJS from 'crypto-js';
import {
  allFullBalancesSelector,
  commissionsApiSelector,
  commissionsUserSelector,
  emptyUsersSelector,
  refLevelsSelector,
  refPercentsSelector,
  usersSelector,
  usersPaginationMetaSelector,
  usernamesSelector,
  usersCommissionsSelector,
} from '../store/selectors';
import { CurrentUserTokenResponseInterface } from 'src/app/shared/types/currentUserTokenResponse.interface';
import { getBotSettingsAction } from '../store/actions/botSettings.action';
import { getApiCommissionAction } from '../store/actions/getApiCommission.action';
import { getUserCommissionAction } from '../store/actions/getUserCommission.action';
import { getRefPercentsAction } from '../store/actions/getRefPercents.action';
import { getAllFullBalancesAction } from '../store/actions/getAllFullBalances.action';
import {
  EmptyTableUser,
  EmptyUsersResponse,
} from 'src/app/shared/types/emptyUsersResponse.interface.interface';
import { getEmptyUsersAction } from '../store/actions/getEmptyUsers.action';
import { actualizeBotsNotStartByApiAction } from '../store/actions/actualizeBotsNotStartByApi.action';
import { generateRandomBase58String } from 'src/app/shared/helpers/helpers';
import { getOpenPositionsAction } from '../store/actions/getOpenPositions.action';
import { getUsernamesAction } from '../store/actions/getUsernames.action';
import { getUsersCommissionsAction } from '../store/actions/getUsersCommissions.action';

export const defaultLimitValue: number = 1000;
export const defaultPageValue: number = 1;

@Injectable({
  providedIn: 'root',
})
export class ControlApiService {
  private user$: Observable<CurrentUserTokenResponseInterface | null>;
  public users$: Observable<ApiWithEmail[]>;
  private usersCommissions$: Observable<UserCommissions[]>;
  private usersPaginationMeta$: Observable<PaginationMeta | null>;
  public usersPaginationMeta: PaginationMeta | null = null;
  private commissionApi$: Observable<CommissionApi[]>;
  public commissionApi: CommissionApi[] = [];
  private commissionUser$: Observable<CommissionUser[]>;
  public commissionUser: CommissionUser[] = [];
  private refLevels$: Observable<RefLevels[]>;
  public refLevels: RefLevels[] = [];
  private allFullBalances$: Observable<AllFullBalance[]>;
  public allFullBalances: AllFullBalance[] = [];
  public users: ApiWithEmail[] = [];
  public usersCommissions: UserCommissions[] = [];
  public originUsers: ApiWithEmail[] = [];
  private emptyUsers$: Observable<EmptyUsersResponse>;
  public emptyUsers: EmptyTableUser[] = [];
  private usernames$: Observable<UserInfo[]>;
  public usernames: UserInfo[] = [];
  private _usernames: string[] = [];

  constructor(private store: Store) {
    this._usernames = [];
  }

  get allUsernames(): string[] {
    return this._usernames;
  }

  private initializeValues() {
    this.user$ = this.store.pipe(select(currentUserSelector));
    this.users$ = this.store.pipe(select(usersSelector));
    this.usersPaginationMeta$ = this.store.pipe(
      select(usersPaginationMetaSelector)
    );
    this.commissionApi$ = this.store.pipe(select(commissionsApiSelector));
    this.commissionUser$ = this.store.pipe(select(commissionsUserSelector));
    this.usersCommissions$ = this.store.pipe(select(usersCommissionsSelector));
    this.refLevels$ = this.store.pipe(select(refLevelsSelector));
    this.allFullBalances$ = this.store.pipe(select(allFullBalancesSelector));
    this.emptyUsers$ = this.store.pipe(select(emptyUsersSelector));
    this.usernames$ = this.store.pipe(select(usernamesSelector));
  }

  toLocale(date: any) {
    const options = { month: 'long', day: 'numeric' };
    // @ts-ignore
    return new Date(date).toLocaleDateString('en-US', options);
  }

  private saveEmptyUsers(emptyUsers: EmptyUsersResponse) {
    this.emptyUsers = [...emptyUsers]
      .sort(
        (a, b) => -new Date(a.regDate).getTime() + new Date(b.regDate).getTime()
      )
      .map((u) => ({
        ...u,
        regDate: this.toLocale(u.regDate),
      }));
    // const emptyUsersWithReferrals: ApiWithEmail[] = this.emptyUsers
    //   .filter((e) => e.hasReferrals)
    //   .filter((e) => !this.users.find((u) => u.username === e.name))
    //   .map((e) => ({
    //     email: e.name,
    //     username: e.name,
    //     status: {
    //       status: 'Stopped',
    //       started: 0,
    //       stopped: 0,
    //       waitForStart: 0,
    //       waitForStop: 0,
    //     },
    //     parentRef: '',
    //     commissionType: 'weekly',
    //     key: '',
    //     secret: '',
    //     name: '',
    //     market: '',
    //     rev_id: '',
    //     botIds: [],
    //   }));

    // this.users = [...this.users, ...emptyUsersWithReferrals];
    // TODO!!!!!!!!!!!!;
  }

  private subscribe() {
    this.user$.subscribe((user) => {
      // Убираем автоматическую загрузку пользователей - теперь управляем из компонента
      // this.store.dispatch(
      //   getUsersAction({
      //     email: user?.email || '',
      //     page: defaultPageValue,
      //     limit: defaultLimitValue,
      //   })
      // );
      // this.store.dispatch(getBotSettingsAction());
      this.store.dispatch(getApiCommissionAction());
      this.store.dispatch(
        getUserCommissionAction({ to: new Date().getTime() })
      );
      this.store.dispatch(getUsersCommissionsAction());
      this.store.dispatch(getRefPercentsAction());
      this.store.dispatch(getAllFullBalancesAction());
      this.store.dispatch(getEmptyUsersAction());
      this.store.dispatch(getUsernamesAction());
    });
    this.users$.subscribe((users) => {
      console.log('Users received in service:', users?.length || 0, 'users');
      this.users = [...users].sort((a, b) => {
        const aGroup = a.username.toLowerCase();
        const bGroup = b.username.toLowerCase();
        return aGroup > bGroup ? 1 : -1;
      });
      this.originUsers = this.users;
    });

    this.usersPaginationMeta$.subscribe((meta) => {
      this.usersPaginationMeta = meta;
    });
    this.commissionApi$.subscribe((commissions) => {
      this.commissionApi = commissions;
    });
    this.commissionUser$.subscribe((commissions) => {
      this.commissionUser = commissions;
    });
    this.refLevels$.subscribe((percents) => {
      this.refLevels = percents;
    });
    this.allFullBalances$.subscribe((balances) => {
      this.allFullBalances = balances;
    });
    this.emptyUsers$.subscribe((emptyUsers) => {
      this.saveEmptyUsers(emptyUsers);
    });
    this.usersCommissions$.subscribe((usersCommissions) => {
      this.usersCommissions = usersCommissions;
    });
    this.usernames$.subscribe((usernames) => {
      // Исправляем: usernames уже является массивом UserInfo[], не объектом с полем data
      this.usernames = usernames || [];
      console.log('usernames: ', this.usernames);

      this._usernames = this.usernames
        .map((user) => user.username)
        .filter((username): username is string => username != null)
        .sort((a, b) => a.localeCompare(b));
    });
  }

  updateUsersWithPassword(pass: string) {
    this.users = this.originUsers.map((u) => {
      let secret = u.secret;
      console.log('secret: ', secret);
      try {
        // Check if secret and pass are valid before attempting decryption
        if (
          !u.secret ||
          !pass ||
          typeof u.secret !== 'string' ||
          typeof pass !== 'string'
        ) {
          console.info('error: invalid secret or password');
          secret = `*${generateRandomBase58String(35)}`;
          return { ...u, secret };
        }

        // Additional check for minimum length to ensure it's potentially encrypted data
        if (u.secret.length < 16) {
          console.info('error: secret too short to be encrypted');
          secret = `*${generateRandomBase58String(35)}`;
          return { ...u, secret };
        }

        const decrypted = CryptoJS.AES.decrypt(u.secret, pass);
        const str = decrypted.toString(CryptoJS.enc.Utf8);
        if (str.length > 0) {
          secret = str;
        } else {
          console.info('error 1');
          secret = `*${generateRandomBase58String(35)}`;
        }
      } catch (e) {
        console.info('error 2', e);
        secret = `*${generateRandomBase58String(35)}`;
      }
      return { ...u, secret };
    });
  }

  init(isOnlyEmptyUsers: boolean = false) {
    if (!isOnlyEmptyUsers) {
      this.initializeValues();
      this.subscribe();
    } else {
      this.usersCommissions$ = this.store.pipe(
        select(usersCommissionsSelector)
      );
      this.usersCommissions$.subscribe((usersCommissions) => {
        this.usersCommissions = usersCommissions;
      });
      this.store.dispatch(getUsersCommissionsAction());
      this.emptyUsers$ = this.store.pipe(select(emptyUsersSelector));
      this.emptyUsers$.subscribe((emptyUsers) => {
        this.saveEmptyUsers(emptyUsers);
      });
      this.store.dispatch(getEmptyUsersAction());
    }
  }

  actualizeBotsInfo(api: ApiWithEmail) {
    if (
      confirm(
        `Актуализируем список ${api.name}. Вы уверены? (Это может затронуть много ботов!!)`
      )
    ) {
      this.store.dispatch(
        actualizeBotsByApiAction({
          email: api.email,
          apiId: api.rev_id,
          apiName: api.name,
        })
      );
    }
  }

  actualizeBotsNotStartInfo(api: ApiWithEmail) {
    if (
      confirm(
        `Актуализируем список ${api.name} БЕЗ СТАРТА. Вы уверены? (Это может затронуть много ботов!!)`
      )
    ) {
      this.store.dispatch(
        actualizeBotsNotStartByApiAction({
          email: api.email,
          apiId: api.rev_id,
          apiName: api.name,
        })
      );
    }
  }
  updateBotsInfo(api: ApiWithEmail) {
    if (confirm(`Обновляем список ${api.name}. Вы уверены?`)) {
      this.store.dispatch(
        updateBotsByApiAction({ email: api.email, apiId: api.rev_id })
      );
    }
  }
  deleteApi(api: ApiWithEmail) {
    if (confirm(`Удаляем ${api.name}. Вы уверены?`)) {
      this.store.dispatch(
        deleteApiAction({ email: api.email, apiId: api.rev_id })
      );
    }
  }
  startApi(api: ApiWithEmail) {
    if (confirm(`Запускаем ${api.name}. Вы уверены?`)) {
      this.store.dispatch(
        startBotAction({ email: api.email, apiId: api.rev_id })
      );
    }
  }
  stopApi(api: ApiWithEmail) {
    if (confirm(`Останавливаем ${api.name}. Вы уверены?`)) {
      this.store.dispatch(
        stopBotAction({ email: api.email, apiId: api.rev_id })
      );
    }
  }
  fullStopApi(api: ApiWithEmail) {
    if (confirm(`Полностью останавливаем ${api.name}. Вы уверены?`)) {
      this.store.dispatch(
        fullStopBotAction({ email: api.email, apiId: api.rev_id })
      );
    }
  }
  // convertBotIdsToNames(user: any) {
  //   // TODO  !!!!!!!!!!!!!! so many requests
  //   return user.botIds.map((b: any) => b.rev_id).join(', ');
  // }
  getOpenPositions(user: ApiWithEmail) {
    this.store.dispatch(getOpenPositionsAction({ apiId: user.rev_id }));
  }

  loadUsers(
    page: number = defaultPageValue,
    limit: number = defaultLimitValue
  ) {
    console.log('loadUsers called with page:', page, 'limit:', limit);
    // Серверная пагинация - всегда делаем запрос к серверу
    this.user$
      .subscribe((user) => {
        console.log(
          'Dispatching getUsersAction with email:',
          user?.email,
          'page:',
          page,
          'limit:',
          limit
        );
        this.store.dispatch(
          getUsersAction({
            email: user?.email || '',
            page,
            limit,
          })
        );
      })
      .unsubscribe();
  }
}
