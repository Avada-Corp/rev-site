import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Subject, Observable } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { MessageService } from 'primeng/api';

import {
  Promocode,
  PromocodeGenerateRequest,
} from '../../store/types/adminState.interface';
import {
  promocodesSelector,
  isLoadingSelector,
  usernamesSelector,
} from '../../store/selectors';
import { getPromocodesAction } from '../../store/actions/getPromocodes.action';
import { generatePromocodesAction } from '../../store/actions/generatePromocodes.action';
import { deactivatePromocodeAction } from '../../store/actions/deactivatePromocode.action';
import { activatePromocodeAction } from '../../store/actions/activatePromocode.action';
import { deletePromocodeAction } from '../../store/actions/deletePromocode.action';
import { getUsernamesAction } from '../../store/actions/getUsernames.action';

@Component({
  selector: 'app-promocodes',
  templateUrl: './promocodes.component.html',
  styleUrls: ['./promocodes.component.scss'],
})
export class PromocodesComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  promocodes$: Observable<Promocode[]>;
  isLoading$: Observable<boolean>;
  usernames$: Observable<any[]>;

  generateForm: FormGroup;
  showGenerateForm = false;
  usersLoaded = false;

  constructor(
    private fb: FormBuilder,
    private store: Store,
    private messageService: MessageService
  ) {
    this.promocodes$ = this.store.select(promocodesSelector);
    this.isLoading$ = this.store.select(isLoadingSelector);
    this.usernames$ = this.store.select(usernamesSelector);

    this.generateForm = this.fb.group({
      amount: [0, [Validators.required, Validators.min(0.01)]],
      count: [1, [Validators.required, Validators.min(1), Validators.max(100)]],
      isReusable: [false],
      expirationDate: [null],
      usageLimit: [null, [Validators.min(1)]],
      referralUser: [null],
      personalCode: [null, [Validators.pattern(/^[A-Z0-9_-]+$/i)]],
    });

    // Отслеживаем изменения isReusable для управления состоянием других полей
    this.generateForm
      .get('isReusable')
      ?.valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe((isReusable) => {
        const usageLimitControl = this.generateForm.get('usageLimit');
        if (isReusable) {
          usageLimitControl?.enable();
        } else {
          usageLimitControl?.disable();
          usageLimitControl?.setValue(null);
        }
      });

    // Отслеживаем изменения personalCode для автоматической настройки
    this.generateForm
      .get('personalCode')
      ?.valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe((personalCode) => {
        const isPersonalCode = personalCode && personalCode.trim();
        const countControl = this.generateForm.get('count');
        const isReusableControl = this.generateForm.get('isReusable');

        if (isPersonalCode) {
          countControl?.disable();
          countControl?.setValue(1);
          isReusableControl?.disable();
          isReusableControl?.setValue(true);
        } else {
          countControl?.enable();
          isReusableControl?.enable();
        }
      });

    // Инициализируем состояние полей
    this.initFormState();
  }

  private initFormState() {
    // Поскольку isReusable изначально false, отключаем usageLimit
    const usageLimitControl = this.generateForm.get('usageLimit');
    usageLimitControl?.disable();
  }

  ngOnInit() {
    this.store.dispatch(getPromocodesAction());
    this.loadUsers();
  }

  private loadUsers() {
    this.store.dispatch(getUsernamesAction());

    // Отслеживаем загрузку пользователей
    this.usernames$.pipe(takeUntil(this.destroy$)).subscribe((users) => {
      console.log('Пользователи для промокодов:', users);
      this.usersLoaded = Boolean(users && users.length > 0);
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onGeneratePromocodes() {
    if (this.generateForm.valid) {
      const formValue = this.generateForm.value;

      // Если указан персональный промокод, автоматически устанавливаем count = 1 и isReusable = true
      const isPersonalCode =
        formValue.personalCode && formValue.personalCode.trim();
      const finalCount = isPersonalCode ? 1 : formValue.count;
      const finalIsReusable = isPersonalCode ? true : formValue.isReusable;

      // Получаем tgAccount выбранного пользователя
      let selectedUserTgAccount: string | undefined;
      console.log('formValue: ', formValue);
      console.log('formValue.referralUser: ', formValue.referralUser);
      if (formValue.referralUser) {
        this.usernames$.pipe(takeUntil(this.destroy$)).subscribe((users) => {
          const selectedUser = users?.find(
            (user) => user.email === formValue.referralUser
          );
          console.log('selectedUser: ', selectedUser);
          selectedUserTgAccount = selectedUser?.tgAccount || undefined;
          console.log('selectedUserTgAccount: ', selectedUserTgAccount);
        });
      }

      // Преобразуем сумму в центы для отправки на сервер
      const amountInCents = Number((formValue.amount * 100).toFixed(0));

      const request: PromocodeGenerateRequest = {
        amount: amountInCents,
        count: finalCount,
        isReusable: finalIsReusable,
        expirationDate: formValue.expirationDate
          ? new Date(formValue.expirationDate).getTime()
          : undefined,
        usageLimit: formValue.usageLimit || undefined,
        referralUser: formValue.referralUser || undefined,
        personalCode: formValue.personalCode?.trim() || undefined,
        tgAccount: selectedUserTgAccount,
      };

      this.store.dispatch(generatePromocodesAction({ request }));
      this.showGenerateForm = false;
      this.generateForm.reset({
        amount: 0,
        count: 1,
        isReusable: false,
        expirationDate: null,
        usageLimit: null,
        referralUser: null,
        personalCode: null,
      });
      this.initFormState();
    } else {
      this.messageService.add({
        severity: 'warn',
        summary: 'Предупреждение',
        detail: 'Заполните все обязательные поля',
      });
    }
  }

  toggleGenerateForm() {
    this.showGenerateForm = !this.showGenerateForm;
    if (!this.showGenerateForm) {
      this.generateForm.reset({
        amount: 0,
        count: 1,
        isReusable: false,
        expirationDate: null,
        usageLimit: null,
        referralUser: null,
        personalCode: null,
      });
      this.initFormState();
    }
  }

  formatDate(timestamp: number): string {
    return new Date(timestamp).toLocaleDateString('ru-RU');
  }

  getStatusText(promocode: Promocode): string {
    if (!promocode.isActive) return 'Неактивен';
    if (promocode.expirationDate && promocode.expirationDate < Date.now())
      return 'Истек';
    if (promocode.usageLimit && promocode.currentUsage >= promocode.usageLimit)
      return 'Исчерпан';
    return 'Активен';
  }

  getStatusClass(promocode: Promocode): string {
    const status = this.getStatusText(promocode);
    switch (status) {
      case 'Активен':
        return 'status-active';
      case 'Истек':
        return 'status-expired';
      case 'Исчерпан':
        return 'status-exhausted';
      case 'Неактивен':
        return 'status-inactive';
      default:
        return '';
    }
  }

  copyToClipboard(text: string) {
    navigator.clipboard.writeText(text).then(() => {
      this.messageService.add({
        severity: 'info',
        summary: 'Скопировано',
        detail: 'Промокод скопирован в буфер обмена',
      });
    });
  }

  /**
   * Форматирует поле ввода денежной суммы до 2 знаков после запятой
   * @param input HTML элемент input
   */
  formatMoneyInput(input: HTMLInputElement) {
    if (!input || !input.value) return;
    const value = parseFloat(input.value);
    if (!isNaN(value)) {
      input.value = value.toFixed(2);
    }
  }

  /**
   * Отключает промокод
   * @param promocodeId ID промокода
   */
  deactivatePromocode(promocodeId: string) {
    this.store.dispatch(deactivatePromocodeAction({ promocodeId }));
  }

  /**
   * Активирует промокод
   * @param promocodeId ID промокода
   */
  activatePromocode(promocodeId: string) {
    this.store.dispatch(activatePromocodeAction({ promocodeId }));
  }

  /**
   * Удаляет промокод
   * @param promocodeId ID промокода
   */
  deletePromocode(promocodeId: string) {
    if (confirm('Вы уверены, что хотите удалить промокод?')) {
      this.store.dispatch(deletePromocodeAction({ promocodeId }));
    }
  }
}
