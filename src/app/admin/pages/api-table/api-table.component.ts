import { Component, OnInit, OnDestroy } from '@angular/core';
import {
  ApiWithEmail,
  OpenPosition,
  PaginationMeta,
  PrivateCommission,
} from '../../store/types/adminState.interface';
import { markets } from 'src/app/shared/rConst';
import { ControlApiService } from '../../services/controlApi.service';
import { select, Store } from '@ngrx/store';
import { Subject, takeUntil, debounceTime, distinctUntilChanged } from 'rxjs';
import { FormControl } from '@angular/forms';
import { updateCommissionFrequencyAction } from '../../store/actions/updateCommissionFrequency.action';
import { Observable, Subscription } from 'rxjs';
import { CurrentUserTokenResponseInterface } from 'src/app/shared/types/currentUserTokenResponse.interface';
import { currentUserSelector } from 'src/app/auth/store/selectors';
import { UserRole } from 'src/app/shared/types/userRole.enum';
import { environment } from 'src/environments/environment';
import { CommissionType } from '../../shared';
import { openPositionsSelector } from '../../store/selectors';
import { ConfirmationService } from 'primeng/api';
import { closePositionAction } from '../../store/actions/closePosition.action';
import { MessageService } from 'primeng/api';
import {
  OpenOrder,
  OpenPositionData,
} from 'src/app/shared/types/response.interface';
import { cancelOrderAction } from '../../store/actions/cancelOrder.action';
import { cancelAllOrdersAction } from '../../store/actions/cancelAllOrders.action';
import { updateParentRefAction } from '../../store/actions/updateParentRef.action';
import { actualizeBotsByApiAction } from '../../store/actions/actualizeBotsByApi.action';
import { actualizeBotsNotStartByApiAction } from '../../store/actions/actualizeBotsNotStartByApi.action';
import { updateBotsByApiAction } from '../../store/actions/updateBotsByApi.action';
import { startBotAction } from '../../../page/store/actions/startBot.action';
import { stopBotAction } from '../../../page/store/actions/stopBot.action';
import { fullStopBotAction } from '../../../page/store/actions/fullStopBot.action';
import { bulkActualizeBotsAction } from '../../store/actions/bulkActualizeBots.action';
import { bulkActualizeBotsNotStartAction } from '../../store/actions/bulkActualizeBotsNotStart.action';
import { bulkStartBotsAction } from '../../store/actions/bulkStartBots.action';
import { bulkStopBotsAction } from '../../store/actions/bulkStopBots.action';
import { AdminService } from '../../services/admin.service';
import { getBotStrategiesAction } from '../../store/actions/botStrategies.action';
import { botStrategiesSelector } from '../../store/selectors';
import { BotStrategy } from '../../store/types/adminState.interface';

@Component({
  selector: 'app-api-table',
  templateUrl: './api-table.component.html',
  styleUrls: ['./api-table.component.scss'],
})
export class ApiTableComponent implements OnInit, OnDestroy {
  private user$: Observable<CurrentUserTokenResponseInterface | null>;
  private openPositions$: Observable<OpenPositionData>;
  private subscriptions: Subscription = new Subscription();
  private destroy$ = new Subject<void>();

  public isSuperAdmin: boolean = false;
  public botStrategies: BotStrategy[] = [];
  isEditForm: boolean = false;
  isShowApi: boolean = false;

  // Поиск
  searchControl = new FormControl('');
  filteredUsers: ApiWithEmail[] = [];
  isCommissionSet: boolean = false;
  isRefSet: boolean = false;
  isPositionsDialogVisible: boolean = false;
  // -------- Rubilnik --------
  isRubilnikDialogVisible: boolean = false;
  rubilnikPairs: string[] = [];
  // --------------------------
  isParentRefDialogVisible: boolean = false;

  // Диалог редактирования срока заморозки пользователя
  isUserFreezePeriodDialogVisible: boolean = false;
  selectedUserFreezePeriod: number | null = null;
  savingUserFreezePeriod: boolean = false;
  currentEditingUserForFreeze: ApiWithEmail | null = null;

  // Диалог редактирования статуса кредитора пользователя
  isUserCreditorDialogVisible: boolean = false;
  selectedUserCreditorStatus: boolean = false;
  savingUserCreditorStatus: boolean = false;
  currentEditingUserForCreditor: ApiWithEmail | null = null;
  creditorOptions = [
    { label: 'Да', value: true },
    { label: 'Нет', value: false },
  ];
  openPositions: OpenPositionData = { positions: [], openOrders: [] };
  currentApiName: string = '';
  openedUser: ApiWithEmail | null = null;

  // Диалог смены стратегии API
  isSetApiStrategyDialogVisible: boolean = false;
  currentApiForStrategy: ApiWithEmail | null = null;

  // Диалог изменения статуса API
  isApiStatusDialogVisible: boolean = false;
  currentApiForStatus: ApiWithEmail | null = null;
  selectedApiStatus: string = 'Остановлен';
  savingApiStatus: boolean = false;

  // Пагинация
  currentPage: number = 1;
  pageSize: number = 20000; // По умолчанию "Все"
  loading: boolean = false;
  refInfo: {
    email: string;
    refPercent1: number | null;
    refPercent2: number | null;
    refPercent3: number | null;
    username: string;
  } | null = null;
  apiCommission:
    | (PrivateCommission & { apiKey: string; apiName: string })
    | null = null;
  userCommission:
    | (PrivateCommission & { email: string; username: string })
    | null = null;
  api: ApiWithEmail | null = null;
  selectedParentRef: string = '';
  currentEditingUser: ApiWithEmail | null = null;

  // Множественный выбор API ключей
  selectedApiKeys: Set<string> = new Set(); // Set API ключей выбранных пользователей

  // Прогресс массовых операций
  bulkOperationProgress: {
    total: number;
    processed: number;
    currentOperation: string;
  } | null = null;

  constructor(
    public controlApiService: ControlApiService,
    public store: Store,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private adminService: AdminService // <--- NEW
  ) {
    this.user$ = this.store.pipe(select(currentUserSelector));
    this.openPositions$ = this.store.pipe(select(openPositionsSelector));
  }

  // Методы для множественного выбора API ключей
  toggleUserSelection(user: ApiWithEmail, isChecked: boolean): void {
    // Получаем все API ключи пользователя
    const userApiKeys = this.controlApiService.users
      .filter((api) => api.email === user.email)
      .map((api) => api.rev_id);

    if (isChecked) {
      // Добавляем все API ключи пользователя
      userApiKeys.forEach((key) => this.selectedApiKeys.add(key));
    } else {
      // Удаляем все API ключи пользователя
      userApiKeys.forEach((key) => this.selectedApiKeys.delete(key));
    }
  }

  toggleApiKeySelection(apiKey: string, isChecked: boolean): void {
    if (isChecked) {
      this.selectedApiKeys.add(apiKey);
    } else {
      this.selectedApiKeys.delete(apiKey);
    }
  }

  isUserSelected(user: ApiWithEmail): boolean {
    // Пользователь считается "выбранным" если у него есть хотя бы один выбранный API ключ
    const userApiKeys = this.controlApiService.users
      .filter((api) => api.email === user.email)
      .map((api) => api.rev_id);

    const selectedUserKeys = userApiKeys.filter((key) =>
      this.selectedApiKeys.has(key)
    );

    return selectedUserKeys.length > 0;
  }

  isUserPartiallySelected(user: ApiWithEmail): boolean {
    // Получаем все API ключи пользователя
    const userApiKeys = this.controlApiService.users
      .filter((api) => api.email === user.email)
      .map((api) => api.rev_id);

    // Получаем количество выбранных ключей пользователя
    const selectedUserKeys = userApiKeys.filter((key) =>
      this.selectedApiKeys.has(key)
    );

    // Возвращаем true если выбраны не все ключи пользователя
    return (
      selectedUserKeys.length > 0 &&
      selectedUserKeys.length < userApiKeys.length
    );
  }

  getUserCheckboxStyleClass(user: ApiWithEmail): string {
    const baseClass = 'user-selection-checkbox';

    if (this.isUserPartiallySelected(user)) {
      return `${baseClass} user-selection-partial`;
    }

    return baseClass;
  }

  // Проверяем, полностью ли выбран пользователь (все его ключи)
  isUserFullySelected(user: ApiWithEmail): boolean {
    // Получаем все API ключи пользователя
    const userApiKeys = this.controlApiService.users
      .filter((api) => api.email === user.email)
      .map((api) => api.rev_id);

    // Получаем количество выбранных ключей пользователя
    const selectedUserKeys = userApiKeys.filter((key) =>
      this.selectedApiKeys.has(key)
    );

    // Возвращаем true если выбраны ВСЕ ключи пользователя
    return (
      selectedUserKeys.length === userApiKeys.length && userApiKeys.length > 0
    );
  }

  // Получаем текст подсказки для чекбокса пользователя
  getUserSelectionTooltip(user: ApiWithEmail): string {
    // Получаем все API ключи пользователя
    const userApiKeys = this.controlApiService.users
      .filter((api) => api.email === user.email)
      .map((api) => api.rev_id);

    // Получаем количество выбранных ключей пользователя
    const selectedUserKeys = userApiKeys.filter((key) =>
      this.selectedApiKeys.has(key)
    );

    if (selectedUserKeys.length === 0) {
      return 'Нажмите для выбора всех API ключей пользователя';
    } else if (selectedUserKeys.length === userApiKeys.length) {
      return `Все API ключи выбраны (${selectedUserKeys.length}/${userApiKeys.length})`;
    } else {
      return `Частично выбрано (${selectedUserKeys.length}/${userApiKeys.length} API ключей)`;
    }
  }

  // Методы для динамического вычисления colspan
  getGroupHeaderColspan(): number {
    // Базовые колонки: Update(1) + Manage(1) + Status(1) + Balance(1) + Commissions(1) +
    // started/stopped(1) + Email(1) + Api name(1) + Market(1) + Bot count(1) = 10
    let colspan = 10;

    // Добавляем колонки для супер-админа
    if (this.isSuperAdmin) {
      // Actualize(1) + Bot api id(1) = 2
      colspan += 2;
    }

    // Добавляем колонки для показа API ключей
    if (this.isShowApi) {
      // Key(1) + Secret(1) = 2
      colspan += 2;
    }

    // Минус 1, так как последняя колонка (Commission) не входит в colspan
    return colspan - 1;
  }

  getTotalApiColspan(): number {
    // Считаем колонки после "Set ref" до "Total Api"
    // Market(1) + Bot count(1) = 2
    let colspan = 2;

    if (this.isSuperAdmin) {
      // Bot api id(1) = 1
      colspan += 1;
    }

    if (this.isShowApi) {
      // Key(1) + Secret(1) = 2
      colspan += 2;
    }

    return colspan;
  }

  getTotalBotsColspan(): number {
    // Всегда показываем только одну колонку для "Total bots"
    let colspan = 1;

    if (this.isShowApi) {
      // Key(1) + Secret(1) = 2
      colspan += 2;
    }

    return colspan;
  }

  getSelectedUsersCount(): number {
    // Считаем уникальных пользователей по выбранным API ключам
    const selectedEmails = new Set<string>();
    this.selectedApiKeys.forEach((apiKey) => {
      const api = this.controlApiService.users.find((u) => u.key === apiKey);
      if (api) {
        selectedEmails.add(api.email);
      }
    });
    return selectedEmails.size;
  }

  getSelectedApiKeysCount(): number {
    return this.selectedApiKeys.size;
  }

  clearSelection(): void {
    this.selectedApiKeys.clear();
  }

  onSelectAllUsersClick(): void {
    // Получаем уникальных пользователей по email
    const uniqueUsers = new Map<string, ApiWithEmail>();
    this.controlApiService.users.forEach((user) => {
      if (user.email && !uniqueUsers.has(user.email)) {
        uniqueUsers.set(user.email, user);
      }
    });

    // Выбираем всех пользователей и их API ключи
    uniqueUsers.forEach((user) => {
      this.toggleUserSelection(user, true);
    });
  }

  // Массовые операции с API ключами
  onBulkActualizeBots(): void {
    if (this.selectedApiKeys.size === 0) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Предупреждение',
        detail: 'Не выбрано ни одного API ключа',
      });
      return;
    }

    const userCount = this.selectedApiKeys.size;
    const confirmMessage = `Актуализируем ботов для ${userCount} выбранных API ключей. Вы уверены? (Это может затронуть много ботов!!)`;

    if (!confirm(confirmMessage)) {
      return;
    }

    // Преобразуем выбранные API ключи в массив объектов с apiId, email, username и apiName
    const apiKeysData = Array.from(this.selectedApiKeys).map((apiKey) => {
      const api = this.controlApiService.users.find((u) => u.rev_id === apiKey);
      return {
        apiId: apiKey,
        email: api?.email || '',
        username: api?.username || '',
        apiName: api?.name || '',
      };
    });

    this.store.dispatch(bulkActualizeBotsAction({ apiKeys: apiKeysData }));

    this.messageService.add({
      severity: 'success',
      summary: 'Успешно',
      detail: `Запущена актуализация для ${userCount} API ключей`,
    });
  }

  onBulkActualizeBotsNotStart(): void {
    if (this.selectedApiKeys.size === 0) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Предупреждение',
        detail: 'Не выбрано ни одного API ключа',
      });
      return;
    }

    const userCount = this.selectedApiKeys.size;
    const confirmMessage = `Актуализируем ботов БЕЗ СТАРТА для ${userCount} выбранных API ключей. Вы уверены? (Это может затронуть много ботов!!)`;

    if (!confirm(confirmMessage)) {
      return;
    }

    // Преобразуем выбранные API ключи в массив объектов с apiId, email, username и apiName
    const apiKeysData = Array.from(this.selectedApiKeys).map((apiKey) => {
      const api = this.controlApiService.users.find((u) => u.rev_id === apiKey);
      return {
        apiId: apiKey,
        email: api?.email || '',
        username: api?.username || '',
        apiName: api?.name || '',
      };
    });

    this.store.dispatch(
      bulkActualizeBotsNotStartAction({ apiKeys: apiKeysData })
    );

    this.messageService.add({
      severity: 'success',
      summary: 'Успешно',
      detail: `Запущена актуализация БЕЗ СТАРТА для ${userCount} API ключей`,
    });
  }

  onBulkStartBots(): void {
    if (this.selectedApiKeys.size === 0) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Предупреждение',
        detail: 'Не выбрано ни одного API ключа',
      });
      return;
    }

    const userCount = this.selectedApiKeys.size;
    const confirmMessage = `Запустить ботов для ${userCount} выбранных API ключей. Вы уверены?`;

    if (!confirm(confirmMessage)) {
      return;
    }

    // Преобразуем выбранные API ключи в массив объектов с apiId и email
    const apiKeysData = Array.from(this.selectedApiKeys).map((apiKey) => {
      const api = this.controlApiService.users.find((u) => u.rev_id === apiKey);
      return {
        apiId: apiKey,
        email: api?.email || '',
      };
    });

    this.store.dispatch(bulkStartBotsAction({ apiKeys: apiKeysData }));

    this.messageService.add({
      severity: 'success',
      summary: 'Успешно',
      detail: `Запущен массовый запуск для ${userCount} API ключей`,
    });
  }

  onBulkStopBots(): void {
    if (this.selectedApiKeys.size === 0) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Предупреждение',
        detail: 'Не выбрано ни одного API ключа',
      });
      return;
    }

    const userCount = this.selectedApiKeys.size;
    const confirmMessage = `Остановить ботов для ${userCount} выбранных API ключей. Вы уверены?`;

    if (!confirm(confirmMessage)) {
      return;
    }

    // Преобразуем выбранные API ключи в массив объектов с apiId и email
    const apiKeysData = Array.from(this.selectedApiKeys).map((apiKey) => {
      const api = this.controlApiService.users.find((u) => u.rev_id === apiKey);
      return {
        apiId: apiKey,
        email: api?.email || '',
      };
    });

    this.store.dispatch(bulkStopBotsAction({ apiKeys: apiKeysData }));

    this.messageService.add({
      severity: 'success',
      summary: 'Успешно',
      detail: `Запущена массовая остановка для ${userCount} API ключей`,
    });
  }

  onBulkUpdateBots(): void {
    if (this.selectedApiKeys.size === 0) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Предупреждение',
        detail: 'Не выбрано ни одного API ключа',
      });
      return;
    }

    const userCount = this.selectedApiKeys.size;
    const confirmMessage = `Обновляем ботов для ${userCount} выбранных API ключей. Вы уверены?`;

    if (confirm(confirmMessage)) {
      this.loading = true;
      let processedCount = 0;
      let errorCount = 0;
      const totalApis = this.selectedApiKeys.size;

      this.bulkOperationProgress = {
        total: totalApis,
        processed: 0,
        currentOperation: 'Обновление ботов',
      };

      Array.from(this.selectedApiKeys).forEach((apiKey) => {
        const api = this.controlApiService.users.find((u) => u.key === apiKey);
        if (api) {
          try {
            this.store.dispatch(
              updateBotsByApiAction({
                email: api.email,
                apiId: api.rev_id,
              })
            );
            processedCount++;
            if (this.bulkOperationProgress) {
              this.bulkOperationProgress.processed = processedCount;
            }
          } catch (error) {
            console.error(`Ошибка при обновлении API ${api.name}:`, error);
            errorCount++;
          }
        }
      });

      this.messageService.add({
        severity: 'success',
        summary: 'Успешно',
        detail: `Запущено обновление для ${processedCount} API ключей${
          errorCount > 0 ? `, ошибок: ${errorCount}` : ''
        }`,
      });

      this.loading = false;
      this.bulkOperationProgress = null;
    }
  }

  onBulkFullStopBots(): void {
    if (this.selectedApiKeys.size === 0) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Предупреждение',
        detail: 'Не выбрано ни одного API ключа',
      });
      return;
    }

    const userCount = this.selectedApiKeys.size;
    const confirmMessage = `Полностью останавливаем ботов для ${userCount} выбранных API ключей. Вы уверены?`;

    if (confirm(confirmMessage)) {
      this.loading = true;
      let processedCount = 0;
      let errorCount = 0;

      Array.from(this.selectedApiKeys).forEach((apiKey) => {
        const api = this.controlApiService.users.find((u) => u.key === apiKey);
        if (api) {
          try {
            this.store.dispatch(
              fullStopBotAction({
                email: api.email,
                apiId: api.rev_id,
              })
            );
            processedCount++;
          } catch (error) {
            console.error(
              `Ошибка при полной остановке API ${api.name}:`,
              error
            );
            errorCount++;
          }
        }
      });

      this.messageService.add({
        severity: 'success',
        summary: 'Успешно',
        detail: `Полностью остановлено ${processedCount} API ключей${
          errorCount > 0 ? `, ошибок: ${errorCount}` : ''
        }`,
      });

      this.loading = false;
    }
  }

  ngOnInit(): void {
    this.controlApiService.init();
    this.setupSearch();

    // Загружаем стратегии при инициализации
    this.store.dispatch(getBotStrategiesAction());

    // Подписываемся на стратегии
    this.subscriptions.add(
      this.store.select(botStrategiesSelector).subscribe((strategies) => {
        this.botStrategies = strategies;
      })
    );

    // Add subscription to the subscription collection
    this.subscriptions.add(
      this.user$.subscribe((user) => {
        this.isSuperAdmin = user?.userRole === UserRole.SuperAdmin;
        // Загружаем данные после инициализации пользователя с небольшой задержкой
        if (user) {
          setTimeout(() => {
            this.loadUsers(this.currentPage, this.pageSize);
          }, 100);
        }
      })
    );

    // Отслеживаем состояние загрузки
    this.subscriptions.add(
      this.store
        .select((state) => (state as any).admin.loaderCount)
        .subscribe((loaderCount) => {
          this.loading = loaderCount > 0;
        })
    );

    // Subscribe to users data
    this.subscriptions.add(
      this.controlApiService.users$.subscribe((users) => {
        console.log('Users updated in component:', users?.length || 0, 'users');
        this.updateFilteredUsers();
      })
    );

    // Subscribe to open positions
    this.subscriptions.add(
      this.openPositions$.subscribe((positions) => {
        // Проверяем формат данных
        // TODO: fix types
        // @ts-ignore
        if (positions.status) {
          this.openPositions = (positions as any).data;
          this.isPositionsDialogVisible = true;
        } else if (Array.isArray(positions)) {
          this.openPositions = positions;
          if (
            this.openPositions.positions.length > 0 ||
            this.openPositions.openOrders.length > 0
          ) {
            this.isPositionsDialogVisible = true;
          }
        } else {
          console.info('Open positions data format is incorrect:', positions);
          this.openPositions = { positions: [], openOrders: [] };
        }
      })
    );

    // Инициализация отфильтрованных пользователей
    this.updateFilteredUsers();
  }

  ngOnDestroy() {
    // Clean up subscriptions
    this.subscriptions.unsubscribe();
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

  filterUsers(searchTerm: string) {
    if (!searchTerm.trim()) {
      this.filteredUsers = [...this.controlApiService.users];
    } else {
      const term = searchTerm.toLowerCase();
      this.filteredUsers = this.controlApiService.users.filter(
        (user) =>
          user.email.toLowerCase().includes(term) ||
          (user.username && user.username.toLowerCase().includes(term)) ||
          (user.parentRef && user.parentRef.toLowerCase().includes(term))
      );
    }
  }

  updateFilteredUsers() {
    this.filterUsers(this.searchControl.value || '');
  }

  closeApiForm() {
    this.isEditForm = false;
    this.api = null;
  }
  editApi(api: ApiWithEmail) {
    this.isEditForm = true;
    this.api = api;
  }

  showOpenPositions(user: ApiWithEmail) {
    this.openedUser = user;
    this.currentApiName = user.name;
    this.controlApiService.getOpenPositions(user);
  }

  closePositionsDialog() {
    this.isPositionsDialogVisible = false;
    this.openPositions = { positions: [], openOrders: [] };
  }

  formatDateFromTimestamp(timestamp: number): string {
    return new Date(timestamp).toLocaleString();
  }

  closePositionMarket(position: OpenPosition) {
    this.confirmationService.confirm({
      message: `Вы уверены, что хотите закрыть позицию ${position.symbol} по рыночной цене? Текущая сторона: ${position.side}`,
      header: 'Подтверждение закрытия позиции',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        const apiId = this.openedUser?.rev_id || null;
        if (apiId === null) {
          this.messageService.add({
            severity: 'error',
            summary: 'Ошибка',
            detail: 'Не удалось получить ID API',
          });
        } else {
          this.store.dispatch(
            closePositionAction({
              apiId,
              position,
            })
          );
        }
      },
    });
  }

  cancelOrder(order: OpenOrder) {
    this.confirmationService.confirm({
      message: `Вы уверены, что хотите отменить ордер ${order.symbol}?`,
      header: 'Подтверждение отмены ордера',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        const apiId = this.openedUser?.rev_id || null;
        if (apiId === null) {
          this.messageService.add({
            severity: 'error',
            summary: 'Ошибка',
            detail: 'Не удалось получить ID API',
          });
        } else {
          this.store.dispatch(
            cancelOrderAction({
              apiId,
              order,
            })
          );
        }
      },
    });
  }

  cancelAllOrders() {
    if (
      !this.openPositions.openOrders ||
      this.openPositions.openOrders.length === 0
    ) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Предупреждение',
        detail: 'Нет открытых ордеров для отмены',
      });
      return;
    }

    this.confirmationService.confirm({
      message: `Вы уверены, что хотите отменить все ордера (${this.openPositions.openOrders.length} шт.)?`,
      header: 'Подтверждение отмены всех ордеров',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        const apiId = this.openedUser?.rev_id || null;
        if (apiId === null) {
          this.messageService.add({
            severity: 'error',
            summary: 'Ошибка',
            detail: 'Не удалось получить ID API',
          });
        } else {
          this.store.dispatch(
            cancelAllOrdersAction({
              apiId,
              orders: this.openPositions.openOrders,
            })
          );
        }
      },
    });
  }

  getMarketName(key: string) {
    return markets.find((m) => m.val === key)?.name;
  }
  getApiCount(api: ApiWithEmail) {
    return this.controlApiService.users.filter((u) => u.email === api.email)
      .length;
  }
  getUserCommission(api: ApiWithEmail) {
    const userCommission = this.controlApiService.commissionUser.find(
      (u) => u.email === api.email
    );
    const privatePercent = userCommission?.privateCommission.percent;
    const privateAbsolute = userCommission?.privateCommission.absolute;
    const countedCommission = userCommission?.countedCommission;
    if (privatePercent != null || privateAbsolute != null) {
      return privatePercent ? privatePercent + '%' : privateAbsolute + 'USDT';
    } else {
      return countedCommission + '%';
    }
  }

  getApiCommission(api: ApiWithEmail) {
    const apiCommission = this.controlApiService.commissionApi.find(
      (a) => a.apiKey === api.key
    );
    const privPercent = apiCommission?.privateCommission?.percent || null;
    const privAbs = apiCommission?.privateCommission?.absolute || null;
    const percent = privPercent ? privPercent + '%' : null;
    const absolute = privAbs ? privAbs + 'USDT' : null;
    return percent ?? absolute;
  }
  getApiBalance(api: ApiWithEmail) {
    return (
      this.controlApiService.commissionApi.find(
        (u) => u.email === api.email && u.apiName === api.name
      )?.apiBalance || 0
    ).toFixed(2);
  }

  getUserBalance(api: ApiWithEmail): string {
    const allApi = this.controlApiService.commissionApi.filter((u) => {
      const apiEmail =
        this.controlApiService.users.find(
          (us) => us.email === u.email && us.name === u.apiName
        )?.email || null;
      return apiEmail === api.email;
    });
    return allApi[0]?.userBalance.toFixed(2);
  }
  getBotsCount(api: ApiWithEmail) {
    return this.controlApiService.users
      .filter((u) => u.email === api.email)
      .reduce((acc, val) => acc + val.botIds.length, 0);
  }
  setUserCommission(api: ApiWithEmail) {
    const comUser = this.controlApiService.commissionUser.find(
      (u) => u.email === api.email
    );
    const privateCommission = comUser?.privateCommission || {
      percent: null,
      absolute: null,
    };
    this.isCommissionSet = true;
    this.userCommission = {
      percent: privateCommission.percent,
      absolute: privateCommission.absolute,
      email: api.email,
      username: api.username,
    };
  }
  setRefPercent(api: ApiWithEmail) {
    const refLevels: {
      refPercent1: number | null;
      refPercent2: number | null;
      refPercent3: number | null;
    } | null =
      this.controlApiService.refLevels.find((u) => u.email === api.email)
        ?.refLevels || null;
    this.isRefSet = true;
    this.refInfo = {
      email: api.email,
      refPercent1: refLevels?.refPercent1 || null,
      refPercent2: refLevels?.refPercent2 || null,
      refPercent3: refLevels?.refPercent3 || null,
      username: api.username,
    };
  }
  getRefPercent(api: ApiWithEmail) {
    const refLevels: {
      refPercent1: number | null;
      refPercent2: number | null;
      refPercent3: number | null;
    } | null =
      this.controlApiService.refLevels.find((u) => u.email === api.email)
        ?.refLevels || null;

    return refLevels?.refPercent1 != null ||
      refLevels?.refPercent2 != null ||
      refLevels?.refPercent3 != null
      ? `1: ${refLevels.refPercent1}%;
      2: ${refLevels.refPercent2}%;
      3: ${refLevels.refPercent3}%;`
      : 'Common';
  }
  setCommission(api: ApiWithEmail) {
    const comApi = this.controlApiService.commissionApi.find(
      (u) => u.apiKey === api.key
    );
    const privateCommission = comApi?.privateCommission || {
      percent: null,
      absolute: null,
    };
    this.isCommissionSet = true;
    this.apiCommission = {
      percent: privateCommission.percent,
      absolute: privateCommission.absolute,
      apiKey: api.key,
      apiName: comApi?.apiName || '',
    };
  }
  flipCommission(api: ApiWithEmail) {
    let newCommissionType: CommissionType = environment.isWeeklyReportsByDefault
      ? 'monthly'
      : 'weekly';
    if (api.commissionType != null) {
      newCommissionType =
        api.commissionType === 'monthly' ? 'weekly' : 'monthly';
    }
    this.store.dispatch(
      updateCommissionFrequencyAction({
        email: api.email,
        commissionType: newCommissionType,
      })
    );
  }

  getCommissionText({ commissionType }: ApiWithEmail) {
    let defaultCommissionType: CommissionType =
      environment.isWeeklyReportsByDefault ? 'weekly' : 'monthly';
    return commissionType != null
      ? commissionType === 'monthly'
        ? 'Ежемесячные комиссии'
        : 'Еженедельные комиссии'
      : defaultCommissionType;
  }
  getUserServiceBalance(api: ApiWithEmail) {
    return (
      this.controlApiService.allFullBalances?.find((a) => a.email === api.email)
        ?.balance || 0
    );
  }
  getUserServiceRefBalance(api: ApiWithEmail) {
    return (
      this.controlApiService.allFullBalances?.find((a) => a.email === api.email)
        ?.refBalance || 0
    );
  }

  showApiClick() {
    if (this.isShowApi) {
      const keyPass = prompt('Пароль') || '';
      this.controlApiService.updateUsersWithPassword(keyPass);
      this.updateFilteredUsers();
    }
  }

  editParentRef(user: ApiWithEmail) {
    this.currentEditingUser = user;
    this.selectedParentRef = user.parentRef;
    this.isParentRefDialogVisible = true;
  }

  onParentRefChange() {
    console.log('this.selectedParentRef: ', this.selectedParentRef);
    if (this.currentEditingUser && this.selectedParentRef) {
      this.store.dispatch(
        updateParentRefAction({
          email: this.currentEditingUser.email,
          parentRef: this.selectedParentRef,
        })
      );
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

  loadUsers(page: number, limit: number) {
    console.log(
      'ApiTableComponent.loadUsers called with page:',
      page,
      'limit:',
      limit
    );
    this.currentPage = page;
    this.pageSize = limit;
    this.controlApiService.loadUsers(page, limit);
    // Обновляем фильтрованные пользователи после загрузки
    setTimeout(() => {
      console.log('Updating filtered users after load');
      this.updateFilteredUsers();
    }, 100);
  }

  onPageChange(newPage: number) {
    // Сбрасываем выбор при смене страницы
    this.clearSelection();
    this.loadUsers(newPage, this.pageSize);
  }

  onPageInputChange(event: Event) {
    const target = event.target as HTMLInputElement;
    const page = parseInt(target.value, 10);
    if (
      page &&
      page > 0 &&
      this.paginationMeta &&
      page <= this.paginationMeta.totalPages
    ) {
      // Сбрасываем выбор при смене страницы
      this.clearSelection();
      this.onPageChange(page);
    }
  }

  get paginationMeta(): PaginationMeta | null {
    return this.controlApiService.usersPaginationMeta;
  }

  getDays(user: ApiWithEmail) {
    const expDate = user.expirationDate;
    if (!expDate) return 0;
    const now = new Date().getTime();
    const diff = expDate - now;
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  }

  openParentRefDialog(user: ApiWithEmail) {
    this.currentEditingUser = user;
    this.isParentRefDialogVisible = true;
  }

  // ---------- Rubilnik methods ----------
  onRubilnikClick(): void {
    this.adminService.getBots().subscribe({
      next: (resp) => {
        const bots = resp?.data || [];
        const pairsSet = new Set<string>();
        bots
          .filter((b) => b.algo === 'long')
          .forEach((b) => pairsSet.add(b.pair));
        this.rubilnikPairs = Array.from(pairsSet);
        this.isRubilnikDialogVisible = true;
      },
      error: (err) => {
        console.error('Ошибка при получении ботов', err);
        this.messageService.add({
          severity: 'error',
          summary: 'Ошибка',
          detail: 'Не удалось получить список ботов',
        });
      },
    });
  }

  onPairClick(pair: string): void {
    console.log('Выбрана пара:', pair);
  }

  // Методы для редактирования срока заморозки пользователя
  editUserFreezePeriod(user: ApiWithEmail): void {
    this.currentEditingUserForFreeze = user;
    this.selectedUserFreezePeriod = user.freezePeriod ?? null;
    this.isUserFreezePeriodDialogVisible = true;
  }

  onUserFreezePeriodChange(): void {
    if (
      this.currentEditingUserForFreeze &&
      this.selectedUserFreezePeriod !== null
    ) {
      this.savingUserFreezePeriod = true;

      this.adminService
        .updateUserFreezePeriod(
          this.currentEditingUserForFreeze.email,
          this.selectedUserFreezePeriod
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
              this.currentEditingUserForFreeze!.freezePeriod =
                this.selectedUserFreezePeriod;
              this.closeUserFreezePeriodDialog();
            } else {
              this.messageService.add({
                severity: 'error',
                summary: 'Ошибка',
                detail: 'Не удалось обновить срок заморозки',
              });
            }
            this.savingUserFreezePeriod = false;
          },
          error: (error) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Ошибка',
              detail: 'Не удалось обновить срок заморозки',
            });
            this.savingUserFreezePeriod = false;
          },
        });
    } else {
      // Если null, снимаем заморозку
      this.onUserFreezePeriodRemove();
    }
  }

  onUserFreezePeriodRemove(): void {
    if (this.currentEditingUserForFreeze) {
      this.savingUserFreezePeriod = true;

      this.adminService
        .removeUserFreezePeriod(this.currentEditingUserForFreeze.email)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response) => {
            if (response.status) {
              this.messageService.add({
                severity: 'success',
                summary: 'Успешно',
                detail: 'Заморозка снята',
              });
              // Обновляем локально
              this.currentEditingUserForFreeze!.freezePeriod = null;
              this.closeUserFreezePeriodDialog();
            } else {
              this.messageService.add({
                severity: 'error',
                summary: 'Ошибка',
                detail: 'Не удалось снять заморозку',
              });
            }
            this.savingUserFreezePeriod = false;
          },
          error: (error) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Ошибка',
              detail: 'Не удалось снять заморозку',
            });
            this.savingUserFreezePeriod = false;
          },
        });
    }
  }

  closeUserFreezePeriodDialog(): void {
    this.isUserFreezePeriodDialogVisible = false;
    this.currentEditingUserForFreeze = null;
    this.selectedUserFreezePeriod = null;
    this.savingUserFreezePeriod = false;
  }

  // Методы для редактирования статуса кредитора пользователя
  editUserCreditorStatus(user: ApiWithEmail): void {
    this.currentEditingUserForCreditor = user;
    this.selectedUserCreditorStatus = user.canWorkOnCredit ?? false;
    this.isUserCreditorDialogVisible = true;
  }

  onUserCreditorStatusChange(): void {
    if (this.currentEditingUserForCreditor) {
      this.savingUserCreditorStatus = true;

      this.adminService
        .updateUserCreditorStatus(
          this.currentEditingUserForCreditor.email,
          this.selectedUserCreditorStatus
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
              this.currentEditingUserForCreditor!.canWorkOnCredit =
                this.selectedUserCreditorStatus;
              this.closeUserCreditorDialog();
            } else {
              this.messageService.add({
                severity: 'error',
                summary: 'Ошибка',
                detail: 'Не удалось обновить статус кредитора',
              });
            }
            this.savingUserCreditorStatus = false;
          },
          error: (error) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Ошибка',
              detail: 'Не удалось обновить статус кредитора',
            });
            this.savingUserCreditorStatus = false;
          },
        });
    }
  }

  closeUserCreditorDialog(): void {
    this.isUserCreditorDialogVisible = false;
    this.currentEditingUserForCreditor = null;
    this.selectedUserCreditorStatus = false;
    this.savingUserCreditorStatus = false;
  }

  // Методы для смены стратегии API
  openSetApiStrategyDialog(api: ApiWithEmail): void {
    this.currentApiForStrategy = api;
    this.isSetApiStrategyDialogVisible = true;
  }

  closeSetApiStrategyDialog(): void {
    this.isSetApiStrategyDialogVisible = false;
    this.currentApiForStrategy = null;
  }

  // Получить название стратегии по ID
  getStrategyName(strategyId: string | undefined): string {
    if (!strategyId) {
      return '';
    }
    const strategy = this.botStrategies.find(
      (s) => s.strategyId === strategyId
    );
    return strategy ? strategy.name : '';
  }

  // Методы для изменения статуса API
  apiStatusOptions = [
    { label: 'Остановлен', value: 'Остановлен' },
    { label: 'Запущен', value: 'Запущен' },
  ];

  editApiStatus(api: ApiWithEmail): void {
    this.currentApiForStatus = api;
    const currentStatus = api.status?.status || 'Stopped';
    // Преобразуем английские статусы в русские для отображения
    if (currentStatus === 'Stopped' || currentStatus === 'Остановлен') {
      this.selectedApiStatus = 'Остановлен';
    } else if (currentStatus === 'Started' || currentStatus === 'Запущен') {
      this.selectedApiStatus = 'Запущен';
    } else {
      this.selectedApiStatus = 'Остановлен';
    }
    this.isApiStatusDialogVisible = true;
  }

  closeApiStatusDialog(): void {
    this.isApiStatusDialogVisible = false;
    this.currentApiForStatus = null;
    this.selectedApiStatus = 'Остановлен';
    this.savingApiStatus = false;
  }

  resetApiStatus(): void {
    if (!this.currentApiForStatus) {
      return;
    }

    this.savingApiStatus = true;
    // Отправляем null для сброса статуса
    this.adminService
      .updateApiStatusManual(this.currentApiForStatus.rev_id, null)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.savingApiStatus = false;
          if (response.status) {
            this.messageService.add({
              severity: 'success',
              summary: 'Успешно',
              detail: 'Статус API сброшен',
            });
            // Обновляем локально
            if (this.currentApiForStatus?.status) {
              this.currentApiForStatus.status.status = 'Stopped';
            }
            this.closeApiStatusDialog();
          } else {
            this.messageService.add({
              severity: 'error',
              summary: 'Ошибка',
              detail: 'Не удалось сбросить статус API',
            });
          }
        },
        error: (error) => {
          this.savingApiStatus = false;
          this.messageService.add({
            severity: 'error',
            summary: 'Ошибка',
            detail: 'Не удалось сбросить статус API',
          });
        },
      });
  }

  onApiStatusChange(): void {
    if (!this.currentApiForStatus) {
      return;
    }

    this.savingApiStatus = true;

    // Преобразуем русские статусы в английские для отправки
    let statusToSend: string;
    if (this.selectedApiStatus === 'Остановлен') {
      statusToSend = 'Stopped';
    } else if (this.selectedApiStatus === 'Запущен') {
      statusToSend = 'Started';
    } else {
      statusToSend = 'Stopped';
    }

    this.adminService
      .updateApiStatusManual(this.currentApiForStatus.rev_id, statusToSend)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.savingApiStatus = false;
          if (response.status) {
            this.messageService.add({
              severity: 'success',
              summary: 'Успешно',
              detail: 'Статус API обновлен',
            });
            // Обновляем локально
            if (this.currentApiForStatus?.status) {
              this.currentApiForStatus.status.status = statusToSend;
            }
            this.closeApiStatusDialog();
          } else {
            this.messageService.add({
              severity: 'error',
              summary: 'Ошибка',
              detail: 'Не удалось обновить статус API',
            });
          }
        },
        error: (error) => {
          this.savingApiStatus = false;
          this.messageService.add({
            severity: 'error',
            summary: 'Ошибка',
            detail: 'Не удалось обновить статус API',
          });
        },
      });
  }

  // --------------------------------------
}
