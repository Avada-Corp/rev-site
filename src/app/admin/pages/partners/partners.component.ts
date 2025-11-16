import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { AdminService } from '../../services/admin.service';
import { MessageService, ConfirmationService } from 'primeng/api';
import { environment } from 'src/environments/environment';
import { Store } from '@ngrx/store';
import {
  partnersSelector,
  usersSelector,
  loaderCountAdminSelector,
  emptyUsersSelector,
} from '../../store/selectors';
import {
  getPartnersAction,
  createPartnerAction,
  updatePartnerAction,
  deletePartnerAction,
} from '../../store/actions/partners.action';
import { getUsersAction } from '../../store/actions/users.action';
import { getEmptyUsersAction } from '../../store/actions/getEmptyUsers.action';
import {
  Partner,
  PartnerUser,
  CreatePartnerRequest,
  UpdatePartnerRequest,
} from '../../store/types/adminState.interface';
import { EmptyUser } from 'src/app/shared/types/emptyUsersResponse.interface.interface';

interface CommissionType {
  label: string;
  value: string;
}

interface PartnerUI extends Partner {
  isEditing: boolean;
  isNew: boolean;
  selectedUser?: PartnerUser; // Добавляем свойство для выбранного пользователя в режиме редактирования
  editingUser?: PartnerUser; // Отдельное свойство для редактирования
  originalValues?: {
    // Добавляем для хранения оригинальных значений
    fixedPayment: number;
    commissionPercent: number;
    commissionType: string;
    disableReferralProgram: boolean;
  };
}

@Component({
  selector: 'app-partners',
  templateUrl: './partners.component.html',
  styleUrls: ['./partners.component.scss'],
})
export class PartnersComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  partners: PartnerUI[] = [];
  users: PartnerUser[] = [];
  emptyUsers: PartnerUser[] = []; // Пустые пользователи
  loading = false;

  // Типы партнеров
  partnerTypes = [
    { label: 'Внутренний партнер', value: 'internal' },
    { label: 'Внешний партнер', value: 'external' },
  ];

  // Типы комиссий для внутренних партнеров
  internalCommissionTypes: CommissionType[] = [
    { label: 'Процент от сервиса', value: 'service' },
    { label: 'Процент от юзеров', value: 'users' },
  ];

  // Типы комиссий для внешних партнеров
  externalCommissionTypes: CommissionType[] = [
    { label: 'По общим правилам', value: 'general_rules' },
    { label: 'Фиксированный платеж', value: 'fixed_payment' },
    { label: 'Процент от прибыли', value: 'profit_percent' },
  ];

  // Все типы комиссий для обратной совместимости
  commissionTypes: CommissionType[] = [
    ...this.internalCommissionTypes,
    ...this.externalCommissionTypes,
  ];

  constructor(
    private fb: FormBuilder,
    private adminService: AdminService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private store: Store
  ) {}

  ngOnInit() {
    // Проверяем доступность страницы
    if (!environment.isMainServer) {
      this.messageService.add({
        severity: 'error',
        summary: 'Ошибка доступа',
        detail: 'Страница партнеров доступна только на главном сервере',
      });
      return;
    }

    this.loadUsers();
    this.loadPartners();
    this.initializeSelectors();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadUsers() {
    console.log('Loading users...');

    // Диспатчим action для загрузки пользователей
    this.store.dispatch(getUsersAction({ email: '', page: 1, limit: 1000 }));

    // Диспатчим action для загрузки пустых пользователей
    this.store.dispatch(getEmptyUsersAction());

    // Подписываемся на селектор пользователей
    this.store
      .select(usersSelector)
      .pipe(takeUntil(this.destroy$))
      .subscribe((users) => {
        if (users && users.length > 0) {
          console.log('Users loaded from store:', users);

          // Фильтруем дубликаты по email
          const uniqueUsers = users.filter(
            (user, index, self) =>
              index === self.findIndex((u) => u.email === user.email)
          );

          this.users = uniqueUsers.map((user) => ({
            email: user.email,
            username: user.username,
          }));
          console.log('Processed unique users:', this.users);

          // Объединяем с пустыми пользователями
          this.mergeUsersWithEmptyUsers();
        } else {
          console.log('No users data in store');
        }
      });

    // Подписываемся на селектор пустых пользователей
    this.store
      .select(emptyUsersSelector)
      .pipe(takeUntil(this.destroy$))
      .subscribe((emptyUsers: EmptyUser[]) => {
        if (emptyUsers && emptyUsers.length > 0) {
          console.log('Empty users loaded from store:', emptyUsers);

          // Преобразуем EmptyUser в PartnerUser
          this.emptyUsers = emptyUsers.map((emptyUser: EmptyUser) => ({
            email: emptyUser.name.startsWith('@')
              ? emptyUser.email
              : emptyUser.name,
            username: emptyUser.name.startsWith('@') ? emptyUser.name : null,
          }));
          console.log('Processed empty users:', this.emptyUsers);

          // Объединяем с обычными пользователями
          this.mergeUsersWithEmptyUsers();
        } else {
          console.log('No empty users data in store');
        }
      });

    // Подписываемся на счетчик загрузки для управления состоянием loading
    this.store
      .select(loaderCountAdminSelector)
      .pipe(takeUntil(this.destroy$))
      .subscribe((loaderCount) => {
        this.loading = loaderCount > 0;
      });
  }

  private mergeUsersWithEmptyUsers() {
    // Получаем только обычных пользователей (исключаем пустых)
    const regularUsers = this.users.filter(
      (user) =>
        !this.emptyUsers.some(
          (emptyUser) =>
            (emptyUser.email && user.email === emptyUser.email) ||
            (emptyUser.username && user.username === emptyUser.username)
        )
    );

    // Фильтруем пустых пользователей, исключая дублирования с обычными
    const filteredEmptyUsers = this.emptyUsers.filter((emptyUser) => {
      return !regularUsers.some(
        (user) =>
          (emptyUser.email && user.email === emptyUser.email) ||
          (emptyUser.username && user.username === emptyUser.username)
      );
    });

    // Объединяем списки
    const allUsers = [...regularUsers, ...filteredEmptyUsers];

    // Сортируем по username/email
    allUsers.sort((a, b) => {
      const aName = a.username || a.email || '';
      const bName = b.username || b.email || '';
      return aName.localeCompare(bName);
    });

    // Обновляем основной список пользователей
    this.users = allUsers;
    console.log('Merged users list:', this.users);
  }

  private initializeSelectors() {
    this.store
      .select(partnersSelector)
      .pipe(takeUntil(this.destroy$))
      .subscribe((partners: Partner[]) => {
        this.partners = partners.map((partner) => ({
          ...partner,
          // Конвертируем fixedPayment из центов в доллары для отображения
          fixedPayment: partner.fixedPayment ? partner.fixedPayment / 100 : 0,
          isEditing: false,
          isNew: false,
        }));
      });
  }

  private loadPartners() {
    this.store.dispatch(getPartnersAction());
  }

  addNewPartner() {
    const newPartner: PartnerUI = {
      partnerType: 'external', // По умолчанию внешний (пока внутренние отключены)
      email: '',
      username: '',
      commissionType: '',
      commissionPercent: 0,
      selectedUsers: [],
      fixedPayment: 0,
      disableReferralProgram: false,
      isEditing: true,
      isNew: true,
      selectedUser: undefined,
      editingUser: undefined,
    };

    this.partners.unshift(newPartner);
  }

  savePartner(partner: PartnerUI, index: number) {
    console.log(
      'this.validatePartner(partner): ',
      this.validatePartner(partner),
      partner
    );
    if (this.validatePartner(partner)) {
      console.log('Сохранение партнера:', partner);

      // Обновляем email и username из выбранного пользователя
      if (partner.editingUser) {
        partner.email = partner.editingUser.email;
        partner.username = partner.editingUser.username || '';
        partner.selectedUser = { ...partner.editingUser }; // Обновляем selectedUser
      } else {
        // Если пользователь не выбран, сбрасываем email и username
        partner.email = '';
        partner.username = '';
        partner.selectedUser = undefined;
      }

      const partnerData: CreatePartnerRequest | UpdatePartnerRequest = {
        partnerType: partner.partnerType,
        email: partner.email || '',
        username: partner.username || '',
        commissionType: partner.commissionType,
        commissionPercent: partner.commissionPercent,
        selectedUserEmails: partner.selectedUsers?.map((u) => u.email) || [],
        // Конвертируем fixedPayment из долларов в центы для отправки в базу
        fixedPayment: partner.fixedPayment
          ? Math.round(partner.fixedPayment * 100)
          : 0,
        disableReferralProgram: partner.disableReferralProgram || false,
      };

      if (partner.isNew) {
        // Создание нового партнера
        this.store.dispatch(
          createPartnerAction({
            partnerData: partnerData as CreatePartnerRequest,
          })
        );
      } else {
        // Обновление существующего партнера
        const updateData = {
          ...partnerData,
          id: partner.id!,
        } as UpdatePartnerRequest;
        this.store.dispatch(updatePartnerAction({ partnerData: updateData }));
      }

      // Завершаем режим редактирования локально
      partner.isEditing = false;
      partner.originalValues = undefined; // Очищаем сохраненные значения
    } else {
      this.messageService.add({
        severity: 'warn',
        summary: 'Предупреждение',
        detail: 'Заполните все обязательные поля',
      });
    }
  }

  editPartner(partner: PartnerUI) {
    // Показываем диалог подтверждения
    this.confirmationService.confirm({
      message: `Вы уверены, что хотите редактировать партнера ${
        partner.username || partner.email || 'без имени'
      }?`,
      header: 'Подтверждение редактирования',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.performEditPartner(partner);
      },
      reject: () => {
        // Ничего не делаем, пользователь отменил
      },
    });
  }

  private performEditPartner(partner: PartnerUI) {
    partner.isEditing = true;

    // Сохраняем оригинальные значения перед редактированием
    partner.originalValues = {
      fixedPayment: partner.fixedPayment || 0,
      commissionPercent: partner.commissionPercent || 0,
      commissionType: partner.commissionType || '',
      disableReferralProgram: partner.disableReferralProgram || false,
    };

    // Если у партнера есть email, находим соответствующего пользователя и устанавливаем его
    if (partner.email) {
      const selectedUser = this.users.find(
        (user) => user.email === partner.email
      );
      if (selectedUser) {
        partner.selectedUser = selectedUser;
        partner.editingUser = { ...selectedUser }; // Копируем для редактирования
      }
    }

    // fixedPayment уже в долларах (был конвертирован при загрузке из базы)
  }

  cancelEdit(partner: PartnerUI, index: number) {
    if (partner.isNew) {
      this.partners.splice(index, 1);
    } else {
      // Восстанавливаем оригинальные значения
      if (partner.originalValues) {
        partner.fixedPayment = partner.originalValues.fixedPayment;
        partner.commissionPercent = partner.originalValues.commissionPercent;
        partner.commissionType = partner.originalValues.commissionType;
        partner.disableReferralProgram =
          partner.originalValues.disableReferralProgram;
      }

      partner.isEditing = false;
      partner.editingUser = undefined; // Сбрасываем редактируемого пользователя
      partner.originalValues = undefined; // Очищаем сохраненные значения
    }
  }

  deletePartner(index: number) {
    const partner = this.partners[index];
    const partnerName = partner.username || partner.email || 'без имени';

    // Показываем диалог подтверждения
    this.confirmationService.confirm({
      message: `Вы уверены, что хотите удалить партнера ${partnerName}? Это действие нельзя отменить.`,
      header: 'Подтверждение удаления',
      icon: 'pi pi-exclamation-triangle',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => {
        this.performDeletePartner(index);
      },
      reject: () => {
        // Ничего не делаем, пользователь отменил
      },
    });
  }

  private performDeletePartner(index: number) {
    const partner = this.partners[index];
    if (partner.id) {
      this.store.dispatch(deletePartnerAction({ partnerId: partner.id }));
    } else {
      // Если партнер еще не сохранен (isNew), просто удаляем локально
      this.partners.splice(index, 1);
    }
  }

  private validatePartner(partner: PartnerUI): boolean {
    // Общие проверки
    if (!partner.editingUser || !partner.commissionType) {
      return false;
    }

    // Валидация для внутренних партнеров
    if (partner.partnerType === 'internal') {
      // Процент обязателен для всех типов внутренних партнеров
      if (!partner.commissionPercent || partner.commissionPercent <= 0) {
        return false;
      }

      // Для типа "users" обязательно выбрать пользователей
      if (
        partner.commissionType === 'users' &&
        partner.selectedUsers.length === 0
      ) {
        return false;
      }
    }

    // Валидация для внешних партнеров
    if (partner.partnerType === 'external') {
      if (partner.commissionType === 'fixed_payment') {
        // Для фиксированного платежа обязательна сумма
        if (!partner.fixedPayment || partner.fixedPayment <= 0) {
          return false;
        }
      } else if (partner.commissionType === 'profit_percent') {
        // Для процента от прибыли обязателен процент
        if (!partner.commissionPercent || partner.commissionPercent <= 0) {
          return false;
        }
      }
      // Для типа 'general_rules' процент НЕ требуется - он автоматический
    }

    return true;
  }

  isUserCommissionType(partner: PartnerUI): boolean {
    return partner.commissionType === 'users';
  }

  isInternalPartner(partner: PartnerUI): boolean {
    return partner.partnerType === 'internal';
  }

  isExternalPartner(partner: PartnerUI): boolean {
    return partner.partnerType === 'external';
  }

  isFixedPaymentType(partner: PartnerUI): boolean {
    return partner.commissionType === 'fixed_payment';
  }

  isGeneralRulesType(partner: PartnerUI): boolean {
    return partner.commissionType === 'general_rules';
  }

  isProfitPercentType(partner: PartnerUI): boolean {
    return partner.commissionType === 'profit_percent';
  }

  // Получить доступные типы комиссий в зависимости от типа партнера
  getAvailableCommissionTypes(partnerType: string): CommissionType[] {
    return partnerType === 'internal'
      ? this.internalCommissionTypes
      : this.externalCommissionTypes;
  }

  // Сбросить поля комиссии при смене типа партнера
  onPartnerTypeChange(partner: PartnerUI) {
    partner.commissionType = '';
    partner.commissionPercent = 0;
    partner.selectedUsers = [];
    partner.fixedPayment = 0;
    partner.disableReferralProgram = false;
  }

  getCommissionTypeLabel(value: string): string {
    const type = this.commissionTypes.find((t) => t.value === value);
    return type ? type.label : value;
  }

  getPartnerTypeLabel(value: string): string {
    const type = this.partnerTypes.find((t) => t.value === value);
    return type ? type.label : value;
  }

  getUsersTooltip(selectedUsers: PartnerUser[]): string {
    if (!selectedUsers || selectedUsers.length === 0) {
      return 'Пользователи не выбраны';
    }

    const usersList = selectedUsers
      .map((user) => {
        const username = user.username ? ` (${user.username})` : '';
        return `<div class="tooltip-user-item">• ${user.email}${username}</div>`;
      })
      .join('');

    return `<div class="tooltip-users-list">${usersList}</div>`;
  }

  // Методы для конвертации сумм
  private convertCentsToDollars(cents: number): number {
    return cents / 100;
  }

  private convertDollarsToCents(dollars: number): number {
    return Math.round(dollars * 100);
  }
}
