import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject, takeUntil, debounceTime, distinctUntilChanged } from 'rxjs';
import { AdminService } from '../../services/admin.service';
import {
  ApiWithEmail,
  AllFullBalance,
  AdminUsersResponse,
  PrivateCommission,
} from '../../store/types/adminState.interface';
import {
  EmptyTableUser,
  EmptyUser,
} from 'src/app/shared/types/emptyUsersResponse.interface.interface';
import { MessageService } from 'primeng/api';
import { FormControl } from '@angular/forms';
import { ControlApiService } from '../../services/controlApi.service';
import { Store, select } from '@ngrx/store';
import {
  emptyUsersSelector,
  commissionsUserSelector,
  refLevelsSelector,
  loaderCountAdminSelector,
  defaultFreezePeriodSelector,
} from '../../store/selectors';
import { getEmptyUsersAction } from '../../store/actions/getEmptyUsers.action';
import { getUserCommissionAction } from '../../store/actions/getUserCommission.action';
import { getRefPercentsAction } from '../../store/actions/getRefPercents.action';
import {
  isRequestCancelled,
  handleCancelledRequest,
} from 'src/app/shared/helpers/helpers';
import { requestCancelledAction } from '../../store/actions/requestCancelled.action';
import {
  updateParentRefAction,
  updateParentRefSuccessAction,
} from '../../store/actions/updateParentRef.action';
import { Actions } from '@ngrx/effects';
import { ofType } from '@ngrx/effects';
import { UserRole } from 'src/app/shared/types/userRole.enum';
import {
  updateUserRoleAction,
  updateUserRoleSuccessAction,
} from '../../store/actions/updateUserRole.action';
import {
  getDefaultFreezePeriodAction,
  updateDefaultFreezePeriodAction,
  updateDefaultFreezePeriodSuccessAction,
} from '../../store/actions/updateDefaultFreezePeriod.action';
import { currentUserSelector } from 'src/app/auth/store/selectors';

interface UserRowData {
  email: string;
  username: string | null;
  isConnected: boolean;
  hasApiKeys?: boolean; // Есть ли API ключи
  totalBalance: number | null;
  parentRef: string | null;
  isEmpty?: boolean; // Пустой аккаунт
  regDate: string | null; // Дата регистрации в ISO формате
  userRole?: UserRole;
  freezePeriod?: number | null; // Срок заморозки аккаунта в днях
  canWorkOnCredit?: boolean; // Может ли пользователь работать в кредит
}

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
})
export class UsersComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  users: UserRowData[] = [];
  filteredUsers: UserRowData[] = [];
  emptyUsers: UserRowData[] = []; // Отдельно храним пустых пользователей
  loading = false;

  // роли
  userRoles = ['User', ...Object.values(UserRole)];
  isSuperAdmin = false;

  searchControl = new FormControl('');

  // Для отправки сообщений
  messageDialogVisible = false;
  selectedUserEmail = '';
  messageText = '';
  sendingMessage = false;

  // Для выделения пользователей
  selectedUsers = new Set<string>(); // Set email адресов выбранных пользователей
  bulkMessageDialogVisible = false;
  bulkMessageText = '';
  sendingBulkMessage = false;
  selectedUsersListDialogVisible = false;

  // Для отображения статистики отправки
  statsDialogVisible = false;
  bulkMessageStats: {
    total: number;
    sent: number;
    skippedDuplicates: number;
    failed: number;
    deduplicationMinutes: number;
  } | null = null;

  // Для редактирования комиссий и рефералов
  isCommissionSet: boolean = false;
  isRefSet: boolean = false;

  // Для редактирования parent ref
  isParentRefDialogVisible: boolean = false;
  selectedParentRef: string = '';
  currentEditingUser: UserRowData | null = null;

  // Для редактирования срока заморозки
  isFreezePeriodDialogVisible: boolean = false;
  selectedFreezePeriod: number | null = null;
  savingFreezePeriod: boolean = false;

  // Для редактирования статуса кредитора
  isCreditorDialogVisible: boolean = false;
  selectedCreditorStatus: boolean = false;
  savingCreditorStatus: boolean = false;
  creditorOptions = [
    { label: 'Да', value: true },
    { label: 'Нет', value: false },
  ];

  // Настройка по умолчанию срока заморозки
  defaultFreezePeriod: number | null = null;

  userCommission:
    | (PrivateCommission & { email: string; username: string })
    | null = null;

  refInfo: {
    email: string;
    refPercent1: number | null;
    refPercent2: number | null;
    refPercent3: number | null;
    username: string;
  } | null = null;

  // Пагинация
  first = 0;
  rows = 50;
  totalRecords = 0;

  // Сортировка
  sortField = '';
  sortOrder = 1;

  constructor(
    private adminService: AdminService,
    private messageService: MessageService,
    public controlApiService: ControlApiService,
    private store: Store,
    private actions$: Actions
  ) {}

  ngOnInit() {
    // check role
    this.store
      .pipe(select(currentUserSelector), takeUntil(this.destroy$))
      .subscribe((user) => {
        this.isSuperAdmin = user?.userRole === UserRole.SuperAdmin;
      });
    this.controlApiService.init();
    this.loadUsers();
    this.setupSearch();

    // Подписываемся на изменения счетчика загрузки для отладки
    this.store
      .pipe(select(loaderCountAdminSelector), takeUntil(this.destroy$))
      .subscribe((loaderCount) => {
        console.log('Admin loader count changed:', loaderCount);
      });

    // Загружаем данные о комиссиях и рефералах
    this.store.dispatch(getUserCommissionAction({ to: new Date().getTime() }));
    this.store.dispatch(getRefPercentsAction());
    console.log('getDefaultFreezePeriodAction@@@@@@@@@@@@');
    // Загружаем настройку по умолчанию срока заморозки
    this.store.dispatch(getDefaultFreezePeriodAction());

    // Подписываемся на данные комиссий и рефералов
    this.store
      .pipe(select(commissionsUserSelector), takeUntil(this.destroy$))
      .subscribe((commissions) => {
        console.log('User commissions loaded:', commissions);
        this.controlApiService.commissionUser = commissions;
        // Обновляем отображение после загрузки
        setTimeout(() => this.filterUsers(this.searchControl.value || ''), 100);
      });

    this.store
      .pipe(select(refLevelsSelector), takeUntil(this.destroy$))
      .subscribe((refLevels) => {
        console.log('Ref levels loaded:', refLevels);
        this.controlApiService.refLevels = refLevels;
        // Обновляем отображение после загрузки
        setTimeout(() => this.filterUsers(this.searchControl.value || ''), 100);
      });

    this.store.dispatch(getEmptyUsersAction());
    this.store
      .pipe(select(emptyUsersSelector), takeUntil(this.destroy$))
      .subscribe((emptyUsers: EmptyUser[]) => {
        console.log('Empty users from store:', emptyUsers);
        if (emptyUsers && emptyUsers.length > 0) {
          this.mergeEmptyUsers(emptyUsers);
        }
      });

    // Подписываемся на настройку по умолчанию срока заморозки
    this.store
      .pipe(select(defaultFreezePeriodSelector), takeUntil(this.destroy$))
      .subscribe((defaultFreezePeriod) => {
        console.log('Default freeze period loaded:', defaultFreezePeriod);
        this.defaultFreezePeriod = defaultFreezePeriod;
      });

    // После успешного обновления parentRef — обновляем список пользователей
    this.actions$
      .pipe(ofType(updateParentRefSuccessAction), takeUntil(this.destroy$))
      .subscribe(() => {
        this.refresh();
      });

    // After parentRef success subscription
    this.actions$
      .pipe(ofType(updateUserRoleSuccessAction), takeUntil(this.destroy$))
      .subscribe(() => {
        this.refresh();
      });

    // // Обновляем балансы после загрузки данных
    // setTimeout(() => {
    //   this.updateUserBalances();
    // }, 2000); // Даем время для загрузки commissionApi данных
  }

  ngOnDestroy() {
    // Принудительно сбрасываем все состояния загрузки
    this.loading = false;
    this.sendingMessage = false;

    this.destroy$.next();
    this.destroy$.complete();
  }

  setupSearch() {
    this.searchControl.valueChanges
      .pipe(debounceTime(300), distinctUntilChanged(), takeUntil(this.destroy$))
      .subscribe((searchTerm) => {
        this.filterUsers(searchTerm || '');
      });
  }

  loadUsers() {
    this.loading = true;
    this.adminService
      .getUsers('', 1, 1000)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response: AdminUsersResponse) => {
          if (response.status) {
            this.processUsers(response.data);
            this.totalRecords = response.meta.total;
          }
          this.loading = false;
        },
        error: (error) => {
          // Проверяем, не был ли запрос отменен и отправляем action для уменьшения счетчика
          if (handleCancelledRequest(error, this.store)) {
            // Запрос был отменён, действие уже отправлено
          } else {
            this.messageService.add({
              severity: 'error',
              summary: 'Ошибка',
              detail: 'Не удалось загрузить пользователей',
            });
          }
          this.loading = false;
        },
        complete: () => {
          // Обеспечиваем сброс loading даже при отмене запроса
          this.loading = false;
        },
      });
  }

  formatDate(dateStr: string): string {
    const date = new Date(dateStr);
    return date.toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  }

  processUsers(apiData: ApiWithEmail[]) {
    console.log('Processing users from API:', apiData);

    // Группируем API по пользователям
    const userMap = new Map<string, UserRowData>();

    apiData.forEach((api) => {
      if (!userMap.has(api.email)) {
        userMap.set(api.email, {
          email: api.email,
          username: api.username,
          isConnected: true, // Все пользователи из /admin/users считаются активными
          hasApiKeys: false,
          totalBalance: 0,
          parentRef: api.parentRef,
          isEmpty: false,
          regDate: api.regDate ? api.regDate.toString() : null,
          userRole: api.userRole,
          freezePeriod: api.freezePeriod || null,
          canWorkOnCredit: api.canWorkOnCredit ?? false,
        });
      }

      const user = userMap.get(api.email)!;

      // Проверяем наличие API ключей
      if (api.name) {
        user.hasApiKeys = true;
      }
    });

    // Сохраняем только обычных пользователей (перезаписываем только их)
    const regularUsers = Array.from(userMap.values());

    console.log('Processed regular users:', regularUsers);

    // Убираем старых обычных пользователей и добавляем новых
    this.users = this.users.filter((user) => user.isEmpty); // Оставляем только пустых
    this.users = [...this.users, ...regularUsers]; // Добавляем обычных

    // Применяем сортировку по умолчанию
    this.users = this.sortUsersByDefault(this.users);
    this.filteredUsers = [...this.users];

    this.updateUserBalances();
  }

  mergeEmptyUsers(emptyUsersFromStore: EmptyUser[]) {
    console.log('Merging empty users from store:', emptyUsersFromStore);

    // Преобразуем EmptyUser в UserRowData и сохраняем отдельно
    this.emptyUsers = emptyUsersFromStore.map((emptyUser: EmptyUser) => {
      return {
        email: emptyUser.name.startsWith('@')
          ? emptyUser.email
          : emptyUser.name,
        username: emptyUser.name.startsWith('@') ? emptyUser.name : null,
        isConnected: false,
        hasApiKeys: false,
        totalBalance: null,
        parentRef: emptyUser.parentRef || null,
        isEmpty: true,
        regDate: emptyUser.regDate ? emptyUser.regDate.toString() : null,
        userRole: emptyUser.userRole,
        freezePeriod: (emptyUser as any).freezePeriod || null,
        canWorkOnCredit: (emptyUser as any).canWorkOnCredit ?? false,
      };
    });

    console.log('Processed empty users:', this.emptyUsers);

    // Перестраиваем общий список
    this.rebuildUsersList();
  }

  rebuildUsersList() {
    // Получаем только обычных пользователей (исключаем пустых)
    const regularUsers = this.users.filter((user) => !user.isEmpty);

    // Фильтруем пустых пользователей, исключая дублирования с обычными
    const filteredEmptyUsers = this.emptyUsers.filter((emptyUser) => {
      return !regularUsers.some(
        (user) =>
          (emptyUser.email && user.email === emptyUser.email) ||
          (emptyUser.username && user.username === emptyUser.username)
      );
    });

    // Объединяем списки
    let allUsers = [...regularUsers, ...filteredEmptyUsers];

    // Сортируем по умолчанию: сначала активные, потом по username
    allUsers = this.sortUsersByDefault(allUsers);

    this.users = allUsers;
    this.filteredUsers = [...this.users];

    console.log('Rebuilt users list:', this.users);
  }

  sortUsersByDefault(users: UserRowData[]): UserRowData[] {
    return users.sort((a, b) => {
      // Сначала сортируем по наличию API ключей (с API первыми)
      if (a.hasApiKeys !== b.hasApiKeys) {
        return b.hasApiKeys ? 1 : -1; // с API ключами (true) первыми
      }

      // Потом по username
      const aUsername = a.username || a.email || '';
      const bUsername = b.username || b.email || '';
      return aUsername.localeCompare(bUsername);
    });
  }

  updateUserBalances() {
    // Используем балансы из controlApiService.commissionApi как на странице API
    this.users.forEach((user) => {
      if (!user.isEmpty && user.hasApiKeys) {
        // Находим балансы для пользователя из commissionApi
        const userCommissions = this.controlApiService.commissionApi.filter(
          (commission) => commission.email === user.email
        );

        if (userCommissions.length > 0) {
          // Берем userBalance из первой записи (как на странице API)
          user.totalBalance = userCommissions[0].userBalance;
        } else {
          user.totalBalance = 0;
        }
      }
    });

    // Обновляем отфильтрованный список
    this.filterUsers(this.searchControl.value || '');
  }

  filterUsers(searchTerm: string) {
    if (!searchTerm.trim()) {
      this.filteredUsers = [...this.users];
    } else {
      const term = searchTerm.toLowerCase();
      this.filteredUsers = this.users.filter(
        (user) =>
          user.email.toLowerCase().includes(term) ||
          (user.username && user.username.toLowerCase().includes(term)) ||
          (user.parentRef && user.parentRef.toLowerCase().includes(term))
      );
    }
  }

  onPageChange(event: any) {
    this.first = event.first;
    this.rows = event.rows;
  }

  onSort(event: any) {
    this.sortField = event.field;
    this.sortOrder = event.order;

    this.filteredUsers.sort((a, b) => {
      let aVal: any;
      let bVal: any;

      switch (event.field) {
        case 'email':
          aVal = a.email;
          bVal = b.email;
          break;
        case 'username':
          aVal = a.username || '';
          bVal = b.username || '';
          break;
        case 'isConnected':
          aVal = a.hasApiKeys ? 1 : 0;
          bVal = b.hasApiKeys ? 1 : 0;
          break;
        case 'totalBalance':
          aVal = a.totalBalance || 0;
          bVal = b.totalBalance || 0;
          break;
        case 'parentRef':
          aVal = a.parentRef || '';
          bVal = b.parentRef || '';
          break;
        case 'userRole':
          aVal = a.userRole || 'User';
          bVal = b.userRole || 'User';
          break;
        case 'regDate':
          // Сортируем по дате регистрации
          if (!a.regDate && !b.regDate) return 0;
          if (!a.regDate) return 1; // Пользователи без даты в конец
          if (!b.regDate) return -1;

          // Сортируем по времени (timestamp)
          aVal = new Date(a.regDate).getTime();
          bVal = new Date(b.regDate).getTime();
          break;
        default:
          return 0;
      }

      if (typeof aVal === 'string') {
        return aVal.localeCompare(bVal) * event.order;
      } else {
        return (aVal - bVal) * event.order;
      }
    });
  }

  openMessageDialog(userEmail: string) {
    this.selectedUserEmail = userEmail;
    this.messageText = '';
    this.messageDialogVisible = true;
  }

  sendMessage() {
    if (!this.messageText.trim() || !this.selectedUserEmail) {
      return;
    }

    this.sendingMessage = true;

    this.adminService
      .sendPersonalMessage(this.selectedUserEmail, this.messageText)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          if (response.status) {
            this.messageService.add({
              severity: 'success',
              summary: 'Успешно',
              detail: 'Сообщение отправлено',
            });
            this.messageDialogVisible = false;
            this.messageText = '';
          } else {
            this.messageService.add({
              severity: 'error',
              summary: 'Ошибка',
              detail:
                (response.errors && response.errors.length > 0
                  ? response.errors[0]
                  : null) || 'Не удалось отправить сообщение',
            });
          }
          this.sendingMessage = false;
        },
        error: (error) => {
          // Проверяем, не был ли запрос отменен и отправляем action для уменьшения счетчика
          if (handleCancelledRequest(error, this.store)) {
            // Запрос был отменён, действие уже отправлено
          } else {
            this.messageService.add({
              severity: 'error',
              summary: 'Ошибка',
              detail: 'Не удалось отправить сообщение',
            });
          }
          this.sendingMessage = false;
        },
        complete: () => {
          // Обеспечиваем сброс sendingMessage даже при отмене запроса
          this.sendingMessage = false;
        },
      });
  }

  getStatusIcon(hasApiKeys: boolean | undefined): string {
    return hasApiKeys ? 'pi pi-check-circle' : 'pi pi-times-circle';
  }

  getStatusClass(hasApiKeys: boolean | undefined): string {
    return hasApiKeys ? 'text-green-500' : 'text-red-500';
  }

  refresh() {
    // Сбрасываем состояние перед обновлением
    this.loading = false;

    this.loadUsers();
    // Перезагружаем пустых пользователей
    this.store.dispatch(getEmptyUsersAction());
    // Перезагружаем данные о комиссиях и рефералах
    this.store.dispatch(getUserCommissionAction({ to: new Date().getTime() }));
    this.store.dispatch(getRefPercentsAction());
  }

  // Методы для редактирования комиссий и рефералов
  setUserCommission(user: UserRowData) {
    // Находим комиссию пользователя
    const comUser = this.controlApiService.commissionUser.find(
      (u) => u.email === user.email
    );
    const privateCommission = comUser?.privateCommission || {
      percent: null,
      absolute: null,
    };

    this.isCommissionSet = true;
    this.userCommission = {
      percent: privateCommission.percent,
      absolute: privateCommission.absolute,
      email: user.email,
      username: user.username || '',
    };
  }

  setRefPercent(user: UserRowData) {
    // Находим реферальные проценты пользователя
    const refLevels: {
      refPercent1: number | null;
      refPercent2: number | null;
      refPercent3: number | null;
    } | null =
      this.controlApiService.refLevels.find((u) => u.email === user.email)
        ?.refLevels || null;

    this.isRefSet = true;
    this.refInfo = {
      email: user.email,
      refPercent1: refLevels?.refPercent1 || null,
      refPercent2: refLevels?.refPercent2 || null,
      refPercent3: refLevels?.refPercent3 || null,
      username: user.username || '',
    };
  }

  closeApiForm() {
    this.isCommissionSet = false;
    this.isRefSet = false;
    this.userCommission = null;
    this.refInfo = null;
  }

  // Методы для отображения текущих комиссий и рефералов
  getUserCommission(user: UserRowData): string {
    const userCommission = this.controlApiService.commissionUser.find(
      (u) => u.email === user.email
    );

    if (!userCommission) return 'Common';

    const privatePercent = userCommission?.privateCommission.percent;
    const privateAbsolute = userCommission?.privateCommission.absolute;
    const countedCommission = userCommission?.countedCommission;

    const percent = privatePercent ? privatePercent + '%' : null;
    const absolute = privateAbsolute ? privateAbsolute + 'USDT' : null;

    return (
      percent ??
      absolute ??
      (countedCommission ? countedCommission.toFixed(2) + '%' : 'Common')
    );
  }

  getRefPercent(user: UserRowData): string {
    const refLevels: {
      refPercent1: number | null;
      refPercent2: number | null;
      refPercent3: number | null;
    } | null =
      this.controlApiService.refLevels.find((u) => u.email === user.email)
        ?.refLevels || null;

    return refLevels?.refPercent1 != null ||
      refLevels?.refPercent2 != null ||
      refLevels?.refPercent3 != null
      ? `1: ${refLevels.refPercent1}%; 2: ${refLevels.refPercent2}%; 3: ${refLevels.refPercent3}%;`
      : 'Common';
  }

  // Логика редактирования parent ref
  editParentRef(user: UserRowData) {
    this.currentEditingUser = user;
    this.selectedParentRef = user.parentRef || '';
    this.isParentRefDialogVisible = true;
  }

  onParentRefChange() {
    if (this.currentEditingUser && this.selectedParentRef) {
      this.store.dispatch(
        updateParentRefAction({
          email: this.currentEditingUser.email,
          parentRef: this.selectedParentRef,
        })
      );

      // Оптимистично обновим локальную модель, чтобы UI сразу отобразил изменения
      this.currentEditingUser.parentRef = this.selectedParentRef;
    }
    this.isParentRefDialogVisible = false;
    this.currentEditingUser = null;
    this.selectedParentRef = '';
  }

  closeParentRefDialog() {
    this.isParentRefDialogVisible = false;
    this.currentEditingUser = null;
    this.selectedParentRef = '';
  }

  // Логика редактирования срока заморозки
  editFreezePeriod(user: UserRowData) {
    this.currentEditingUser = user;
    this.selectedFreezePeriod = user.freezePeriod ?? null;
    this.isFreezePeriodDialogVisible = true;
  }

  onFreezePeriodChange() {
    if (this.currentEditingUser && this.selectedFreezePeriod !== null) {
      this.savingFreezePeriod = true;

      this.adminService
        .updateUserFreezePeriod(
          this.currentEditingUser.email,
          this.selectedFreezePeriod
        )
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response) => {
            if (response.status) {
              this.messageService.add({
                severity: 'success',
                summary: 'Успешно',
                detail: 'Срок заморозки обновлен',
              });
              // Обновляем локально
              this.currentEditingUser!.freezePeriod = this.selectedFreezePeriod;
              this.closeFreezePeriodDialog();
            } else {
              this.messageService.add({
                severity: 'error',
                summary: 'Ошибка',
                detail: 'Не удалось обновить срок заморозки',
              });
            }
            this.savingFreezePeriod = false;
          },
          error: (error) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Ошибка',
              detail: 'Не удалось обновить срок заморозки',
            });
            this.savingFreezePeriod = false;
          },
        });
    } else {
      // Если null, снимаем заморозку
      this.onFreezePeriodRemove();
    }
  }

  onFreezePeriodRemove() {
    if (this.currentEditingUser) {
      this.savingFreezePeriod = true;

      this.adminService
        .removeUserFreezePeriod(this.currentEditingUser.email)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response) => {
            if (response.status) {
              this.messageService.add({
                severity: 'success',
                summary: 'Успешно',
                detail: 'Заморозка аккаунта снята',
              });
              // Обновляем локально
              this.currentEditingUser!.freezePeriod = null;
              this.closeFreezePeriodDialog();
            } else {
              this.messageService.add({
                severity: 'error',
                summary: 'Ошибка',
                detail: 'Не удалось снять заморозку',
              });
            }
            this.savingFreezePeriod = false;
          },
          error: (error) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Ошибка',
              detail: 'Не удалось снять заморозку',
            });
            this.savingFreezePeriod = false;
          },
        });
    }
  }

  closeFreezePeriodDialog() {
    this.isFreezePeriodDialogVisible = false;
    this.currentEditingUser = null;
    this.selectedFreezePeriod = null;
    this.savingFreezePeriod = false;
  }

  // Методы для редактирования статуса кредитора
  editCreditorStatus(user: UserRowData) {
    this.currentEditingUser = user;
    this.selectedCreditorStatus = user.canWorkOnCredit ?? false;
    this.isCreditorDialogVisible = true;
  }

  onCreditorStatusChange() {
    if (this.currentEditingUser) {
      this.savingCreditorStatus = true;

      this.adminService
        .updateUserCreditorStatus(
          this.currentEditingUser.email,
          this.selectedCreditorStatus
        )
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response) => {
            if (response.status) {
              this.messageService.add({
                severity: 'success',
                summary: 'Успешно',
                detail: 'Статус кредитора обновлен',
              });
              // Обновляем локально
              this.currentEditingUser!.canWorkOnCredit =
                this.selectedCreditorStatus;
              this.closeCreditorDialog();
            } else {
              this.messageService.add({
                severity: 'error',
                summary: 'Ошибка',
                detail: 'Не удалось обновить статус кредитора',
              });
            }
            this.savingCreditorStatus = false;
          },
          error: (error) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Ошибка',
              detail: 'Не удалось обновить статус кредитора',
            });
            this.savingCreditorStatus = false;
          },
        });
    }
  }

  closeCreditorDialog() {
    this.isCreditorDialogVisible = false;
    this.currentEditingUser = null;
    this.selectedCreditorStatus = false;
    this.savingCreditorStatus = false;
  }

  changeUserRole(user: UserRowData, newRole: UserRole) {
    this.store.dispatch(
      updateUserRoleAction({ email: user.email, role: newRole })
    );
    // optimistic update
    (user as any).userRole = newRole;
  }

  updateDefaultFreezePeriod() {
    if (this.defaultFreezePeriod !== null && this.defaultFreezePeriod > 0) {
      this.store.dispatch(
        updateDefaultFreezePeriodAction({
          freezePeriod: this.defaultFreezePeriod,
        })
      );
      this.messageService.add({
        severity: 'success',
        summary: 'Успешно',
        detail: 'Настройка по умолчанию обновлена',
      });
    } else if (this.defaultFreezePeriod === null) {
      this.store.dispatch(
        updateDefaultFreezePeriodAction({ freezePeriod: null })
      );
      this.messageService.add({
        severity: 'success',
        summary: 'Успешно',
        detail: 'Настройка по умолчанию снята',
      });
    } else {
      this.messageService.add({
        severity: 'error',
        summary: 'Ошибка',
        detail: 'Введите корректное значение (больше 0)',
      });
    }
  }

  // Методы для выделения пользователей
  isUserSelected(user: UserRowData): boolean {
    return this.selectedUsers.has(user.email);
  }

  toggleUserSelection(user: UserRowData) {
    if (this.selectedUsers.has(user.email)) {
      this.selectedUsers.delete(user.email);
    } else {
      this.selectedUsers.add(user.email);
    }
  }

  getCurrentPageUsers(): UserRowData[] {
    // Получаем только пользователей на текущей странице пагинации
    const start = this.first;
    const end = this.first + this.rows;
    return this.filteredUsers.slice(start, end);
  }

  selectAllUsers() {
    // Выделяем только пользователей на текущей странице
    const currentPageUsers = this.getCurrentPageUsers();
    currentPageUsers.forEach((user) => {
      if (user.email) {
        this.selectedUsers.add(user.email);
      }
    });
  }

  deselectAllUsers() {
    // Снимаем выделение только с пользователей на текущей странице
    const currentPageUsers = this.getCurrentPageUsers();
    currentPageUsers.forEach((user) => {
      if (user.email) {
        this.selectedUsers.delete(user.email);
      }
    });
  }

  getSelectedUsersCount(): number {
    return this.selectedUsers.size;
  }

  getSelectedUsersList(): Array<{ username: string | null; email: string }> {
    const selectedEmails = Array.from(this.selectedUsers);
    return selectedEmails
      .map((email) => {
        const user = this.users.find((u) => u.email === email);
        return {
          username: user?.username || null,
          email: email,
        };
      })
      .sort((a, b) => {
        const aDisplay = a.username || a.email;
        const bDisplay = b.username || b.email;
        return aDisplay.localeCompare(bDisplay);
      });
  }

  openSelectedUsersListDialog() {
    this.selectedUsersListDialogVisible = true;
  }

  closeSelectedUsersListDialog() {
    this.selectedUsersListDialogVisible = false;
  }

  areAllPageUsersSelected(): boolean {
    const currentPageUsers = this.getCurrentPageUsers();
    if (currentPageUsers.length === 0) return false;
    return currentPageUsers.every(
      (user) => !user.email || this.selectedUsers.has(user.email)
    );
  }

  onSelectAllCheckboxChange(checked: boolean) {
    if (checked) {
      this.selectAllUsers();
    } else {
      this.deselectAllUsers();
    }
  }

  openBulkMessageDialog() {
    if (this.selectedUsers.size === 0) {
      return;
    }
    this.bulkMessageText = '';
    this.bulkMessageDialogVisible = true;
  }

  closeBulkMessageDialog() {
    this.bulkMessageDialogVisible = false;
    this.bulkMessageText = '';
  }

  sendBulkMessage() {
    if (!this.bulkMessageText.trim() || this.selectedUsers.size === 0) {
      return;
    }

    this.sendingBulkMessage = true;
    const users = Array.from(this.selectedUsers);

    this.adminService
      .sendPersonalMessagesBulk(users, this.bulkMessageText)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          if (response.status) {
            // Извлекаем статистику из ответа
            if (response.data && response.data.stats) {
              this.bulkMessageStats = response.data.stats;
              this.statsDialogVisible = true;
            }
            this.messageService.add({
              severity: 'success',
              summary: 'Успешно',
              detail: `Сообщения отправлены ${users.length} пользователям`,
            });
            this.closeBulkMessageDialog();
            this.selectedUsers.clear();
          } else {
            this.messageService.add({
              severity: 'error',
              summary: 'Ошибка',
              detail:
                (response.errors && response.errors.length > 0
                  ? response.errors[0]
                  : null) || 'Не удалось отправить сообщения',
            });
          }
          this.sendingBulkMessage = false;
        },
        error: (error) => {
          // Проверяем, не был ли запрос отменен и отправляем action для уменьшения счетчика
          if (handleCancelledRequest(error, this.store)) {
            // Запрос был отменён, действие уже отправлено
          } else {
            this.messageService.add({
              severity: 'error',
              summary: 'Ошибка',
              detail: 'Не удалось отправить сообщения',
            });
          }
          this.sendingBulkMessage = false;
        },
        complete: () => {
          // Обеспечиваем сброс sendingBulkMessage даже при отмене запроса
          this.sendingBulkMessage = false;
        },
      });
  }

  closeStatsDialog() {
    this.statsDialogVisible = false;
    this.bulkMessageStats = null;
  }
}
