import { Component, OnDestroy } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import {
  WalletBalance,
  WalletCommission,
  ExpectedPayment,
} from 'src/app/page/types/page.interface';
import {
  walletsSelector,
  selectedWalletCommissionsSelector,
  selectedWalletManualTransactionsSelector,
  selectedWalletReferralTransactionsSelector,
  selectedWalletReferralWithdrawalsSelector,
  selectedWalletPartnerCommissionsSelector,
  selectedWalletCryptoTransactionsSelector,
  selectedWalletEmailSelector,
  walletDetailsExpectedPaymentsSelector,
  walletDetailsEmailSelector,
  userCommissionReportSelector,
  userCommissionReportTextSelector,
  userCommissionReportPdfSelector,
  isUserCommissionReportLoadingSelector,
  userCommissionReportErrorSelector,
} from '../../store/selectors';
import { getWalletsAction } from './../../store/actions/getWallets.action';
import { getWalletHistoryAction } from '../../store/actions/getWalletHistory.action';
import { topUpBalanceAction } from '../../store/actions/topUpBalance.action';
import { withdrawRefBalanceAction } from '../../store/actions/withdrawRefBalance.action';
import { getWalletDetailsAction } from '../../store/actions/getWalletDetails.action';
import { getUserCommissionReportAction } from '../../store/actions/getUserCommissionReport.action';
import { CheckboxChangeEvent } from 'primeng/checkbox';
import { ControlApiService } from '../../services/controlApi.service';
import { AdminService } from '../../services/admin.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-wallets',
  templateUrl: './wallets.component.html',
  styleUrls: ['./wallets.component.scss'],
})
export class WalletsComponent implements OnDestroy {
  private wallets$: Observable<WalletBalance[]>;
  private selectedWalletCommissions$: Observable<WalletCommission[]>;
  private selectedWalletManualTransactions$: Observable<WalletCommission[]>;
  private selectedWalletReferralTransactions$: Observable<WalletCommission[]>;
  private selectedWalletReferralWithdrawals$: Observable<WalletCommission[]>;
  private selectedWalletPartnerCommissions$: Observable<WalletCommission[]>;
  private selectedWalletCryptoTransactions$: Observable<WalletCommission[]>;
  private selectedWalletEmail$: Observable<string | null>;
  private walletDetailsExpectedPayments$: Observable<ExpectedPayment[]>;
  private walletDetailsEmail$: Observable<string | null>;
  private userCommissionReport$: Observable<any>;
  private userCommissionReportText$: Observable<string>;
  private userCommissionReportPdf$: Observable<{
    pdfBase64: string;
    pdfUrl: string;
  }>;
  private isUserCommissionReportLoading$: Observable<boolean>;
  private userCommissionReportError$: Observable<string | null>;
  private subscription: Subscription = new Subscription();
  public wallets: WalletBalance[] = [];
  public filteredWallets: WalletBalance[] = [];
  public displayCommissionsModal = false;
  public selectedWalletCommissions: WalletCommission[] = [];
  public selectedWalletManualTransactions: WalletCommission[] = [];
  public selectedWalletReferralTransactions: WalletCommission[] = [];
  public selectedWalletReferralWithdrawals: WalletCommission[] = [];
  public selectedWalletPartnerCommissions: WalletCommission[] = [];
  public selectedWalletCryptoTransactions: WalletCommission[] = [];
  public modalTitle: string = '';
  public displayTopUpModal = false;
  public topUpAmount: number | null = null;
  private selectedEmail: string = '';
  public currentUserBalance: number = 0;
  public hideZeroBalance: boolean = false;

  // Свойства для отправки сообщений
  public displayMessageModal = false;
  public messageModalTitle: string = '';
  public messageText: string = '';
  public selectedUserInfo: string = '';
  private selectedUserEmail: string = '';

  // Свойства для детальной информации о кошельке
  public displayWalletDetailsModal = false;
  public walletDetailsModalTitle: string = '';
  public expectedPayments: ExpectedPayment[] = [];
  public selectedWalletDetailsEmail: string = '';
  public selectedWalletDetailsUser: string = '';
  public selectedWalletDetailsBalance: number = 0;

  // Свойства для модального окна отчетов
  public displayReportsModal = false;
  public reportsModalTitle: string = '';
  public reportText: string = '';
  public reportPdfBase64: string = '';
  public reportPdfUrl: string = '';
  public isReportLoading = false;
  public currentReportEmail: string = '';

  constructor(
    private store: Store,
    private controlApiService: ControlApiService,
    private adminService: AdminService,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    this.initializeValues();
    this.subscribe();
  }

  private initializeValues() {
    this.wallets$ = this.store.pipe(select(walletsSelector));
    this.selectedWalletCommissions$ = this.store.pipe(
      select(selectedWalletCommissionsSelector)
    );
    this.selectedWalletManualTransactions$ = this.store.pipe(
      select(selectedWalletManualTransactionsSelector)
    );
    this.selectedWalletReferralTransactions$ = this.store.pipe(
      select(selectedWalletReferralTransactionsSelector)
    );
    this.selectedWalletReferralWithdrawals$ = this.store.pipe(
      select(selectedWalletReferralWithdrawalsSelector)
    );
    this.selectedWalletPartnerCommissions$ = this.store.pipe(
      select(selectedWalletPartnerCommissionsSelector)
    );
    this.selectedWalletCryptoTransactions$ = this.store.pipe(
      select(selectedWalletCryptoTransactionsSelector)
    );
    this.selectedWalletEmail$ = this.store.pipe(
      select(selectedWalletEmailSelector)
    );
    this.walletDetailsExpectedPayments$ = this.store.pipe(
      select(walletDetailsExpectedPaymentsSelector)
    );
    this.walletDetailsEmail$ = this.store.pipe(
      select(walletDetailsEmailSelector)
    );

    // User commission report selectors
    this.userCommissionReport$ = this.store.pipe(
      select(userCommissionReportSelector)
    );
    this.userCommissionReportText$ = this.store.pipe(
      select(userCommissionReportTextSelector)
    );
    this.userCommissionReportPdf$ = this.store.pipe(
      select(userCommissionReportPdfSelector)
    );
    this.isUserCommissionReportLoading$ = this.store.pipe(
      select(isUserCommissionReportLoadingSelector)
    );
    this.userCommissionReportError$ = this.store.pipe(
      select(userCommissionReportErrorSelector)
    );
    this.store.dispatch(getWalletsAction());
    this.controlApiService.init(true);
  }

  private formatReferralExplanation(explanation: string): string {
    // Проверяем наличие нужной части текста
    if (!explanation.includes('Ручное пополнение баланса администратором')) {
      return explanation;
    }

    // Извлекаем сумму и логин
    const amountMatch = explanation.match(/сумму (\d+)/);
    const loginMatch = explanation.match(/для (\S+@tg\.login)/);

    if (!amountMatch || !loginMatch) {
      return explanation;
    }

    const amount = amountMatch[1];
    const login = loginMatch[1];
    const username =
      this.wallets.find((w) => w.email === login)?.tgUserName || '';
    return `Ручное пополнение администратором на сумму ${(
      (Number(amount) || 0) / 100
    ).toFixed(2)} USDT для (${username})${login}`;
  }

  public showCommissionsHistory(email: string) {
    this.store.dispatch(getWalletHistoryAction({ email }));

    const wallet = this.wallets.find((w) => w.email === email);
    this.modalTitle = `История операций пользователя ${email} ${
      wallet?.tgUserName ? `(${wallet.tgUserName})` : ''
    }`;

    this.displayCommissionsModal = true;
  }

  private updateFilteredWallets(): void {
    if (this.hideZeroBalance) {
      this.filteredWallets = this.filteredWallets.filter(
        (w) => w.accountBalance !== 0
      );
    } else {
      this.filteredWallets = [...this.wallets];
    }
  }

  public clickZeroFilter(event: CheckboxChangeEvent): void {
    this.hideZeroBalance = event.checked;
    this.updateFilteredWallets();
  }

  private subscribe() {
    const walletsSub = this.wallets$.subscribe((wallets) => {
      if (wallets && Array.isArray(wallets)) {
        this.wallets = [...wallets];
        this.updateFilteredWallets();
      }
    });
    this.subscription.add(walletsSub);

    const commissionsSub = this.selectedWalletCommissions$.subscribe(
      (commissions) => {
        this.selectedWalletCommissions = commissions || [];
      }
    );
    this.subscription.add(commissionsSub);

    const manualTransactionsSub =
      this.selectedWalletManualTransactions$.subscribe((transactions) => {
        this.selectedWalletManualTransactions = transactions || [];
      });
    this.subscription.add(manualTransactionsSub);

    const referralTransactionsSub =
      this.selectedWalletReferralTransactions$.subscribe((transactions) => {
        this.selectedWalletReferralTransactions = (transactions || []).map(
          (t) => ({
            ...t,
            explanation: this.formatReferralExplanation(t.explanation),
          })
        );
      });
    this.subscription.add(referralTransactionsSub);

    const referralWithdrawalsSub =
      this.selectedWalletReferralWithdrawals$.subscribe((withdrawals) => {
        this.selectedWalletReferralWithdrawals = (withdrawals || []).map(
          (w) => ({
            ...w,
            explanation: this.formatReferralExplanation(w.explanation),
          })
        );
      });
    this.subscription.add(referralWithdrawalsSub);

    const partnerCommissionsSub =
      this.selectedWalletPartnerCommissions$.subscribe((commissions) => {
        this.selectedWalletPartnerCommissions = (commissions || []).map(
          (w) => ({
            ...w,
            explanation: this.formatReferralExplanation(w.explanation),
          })
        );
      });
    this.subscription.add(partnerCommissionsSub);

    const cryptoTransactionsSub =
      this.selectedWalletCryptoTransactions$.subscribe((transactions) => {
        this.selectedWalletCryptoTransactions = (transactions || []).map(
          (t) => ({
            ...t,
            explanation: this.formatReferralExplanation(t.explanation),
          })
        );
      });
    this.subscription.add(cryptoTransactionsSub);

    const walletDetailsExpectedPaymentsSub =
      this.walletDetailsExpectedPayments$.subscribe((expectedPayments) => {
        this.expectedPayments = expectedPayments || [];
      });
    this.subscription.add(walletDetailsExpectedPaymentsSub);

    // Подписки на отчет пользователя
    const userCommissionReportTextSub =
      this.userCommissionReportText$.subscribe((text) => {
        this.reportText = text;
      });
    this.subscription.add(userCommissionReportTextSub);

    const userCommissionReportPdfSub = this.userCommissionReportPdf$.subscribe(
      (pdf) => {
        this.reportPdfBase64 = pdf.pdfBase64;
        this.reportPdfUrl = pdf.pdfUrl;
      }
    );
    this.subscription.add(userCommissionReportPdfSub);

    const isUserCommissionReportLoadingSub =
      this.isUserCommissionReportLoading$.subscribe((isLoading) => {
        this.isReportLoading = isLoading;
      });
    this.subscription.add(isUserCommissionReportLoadingSub);

    const userCommissionReportErrorSub =
      this.userCommissionReportError$.subscribe((error) => {
        if (error) {
          this.messageService.add({
            severity: 'error',
            summary: 'Ошибка',
            detail: error,
            life: 5000,
          });
        }
      });
    this.subscription.add(userCommissionReportErrorSub);
  }

  public formatExplanation(explanation: string): string {
    if (!explanation) return '';

    // Проверяем, содержит ли строка JSON
    if (explanation.includes('{') && explanation.includes('}')) {
      try {
        // Извлекаем базовую информацию и JSON часть
        const baseInfoMatch = explanation.match(/(.*?):\s*(\{.*\})/);
        if (baseInfoMatch && baseInfoMatch.length >= 3) {
          const baseInfo = baseInfoMatch[1].trim();
          const jsonData = JSON.parse(baseInfoMatch[2]);

          // Формируем читаемый текст
          let formattedText = `${baseInfo}\n`;

          // Добавляем информацию о периоде
          if (jsonData.startDate && jsonData.endDate) {
            formattedText += `Период: ${jsonData.startDate} - ${jsonData.endDate}\n`;
          }
          const usernameInfo =
            jsonData.username && jsonData.username !== 'no username'
              ? ` ${jsonData.username}`
              : jsonData.email || '';
          // Добавляем информацию о пользователе
          if (jsonData.email) {
            formattedText += `Пользователь: ${usernameInfo}`;
            formattedText += '\n';
          }

          // Добавляем информацию об API
          if (jsonData.apis && Array.isArray(jsonData.apis)) {
            formattedText += `\nДанные по API:\n`;

            // Выводим данные для каждого API отдельно
            jsonData.apis.forEach((api: any) => {
              formattedText += `\n--- ${api.apiName} ---\n`;
              formattedText += `Результат за период: ${api.resultForPeriod?.toFixed(
                2
              )}\n`;
              formattedText += `Комиссия: ${api.commission?.toFixed(2)}\n`;
              formattedText += `PnL начало: ${api.startPnl?.toFixed(2)}\n`;
              formattedText += `PnL конец: ${api.endPnl?.toFixed(2)}\n`;
              formattedText += `Накопительный PnL: ${api.cumulativePnl?.toFixed(
                2
              )}\n`;

              // Информация о реферальных выплатах для этого API
              if (api.refPaid && api.refPaid.length > 0) {
                formattedText += `Реферальные выплаты:\n`;
                api.refPaid
                  .filter((r: any) => r != null)
                  .forEach((payment: any) => {
                    if (payment.email && payment.amount !== undefined) {
                      formattedText += `  - ${payment.email}(${
                        payment.username
                      }): ${payment.amount?.toFixed(2)} (${payment.explanation
                        .split(',')[0]
                        .replace('Комиссия за ', '')
                        .replace(' уровня', '')})\n`;
                    }
                  });
              }
            });

            // Суммарная информация
            formattedText += `\n--- Итого ---\n`;
            if (jsonData.totalCommission !== undefined) {
              formattedText += `Общая комиссия: ${jsonData.totalCommission?.toFixed(
                2
              )}\n`;
            }

            if (jsonData.userBalance !== undefined) {
              formattedText += `Баланс пользователя: ${jsonData.userBalance?.toFixed(
                2
              )}\n`;
            }

            if (jsonData.privateCommission) {
              formattedText += `Комиссия: `;
              if (jsonData.privateCommission.percent !== undefined) {
                formattedText += `${jsonData.privateCommission.percent}%`;
              }
              if (
                jsonData.privateCommission.absolute !== undefined &&
                jsonData.privateCommission.absolute !== null
              ) {
                formattedText += ` (${jsonData.privateCommission.absolute})`;
              }
              formattedText += `\n`;
            }
          }

          return formattedText;
        }
      } catch (e) {
        console.error('wallets Ошибка при парсинге JSON в описании:', e);
      }
    }

    // Если не удалось распарсить или это не JSON, возвращаем исходный текст
    return explanation;
  }

  /**
   * Метод для пополнения баланса кошелька
   * @param email Email пользователя
   * @param amount Сумма пополнения
   */
  topUpBalance(email: string, amount: number): void {
    const fixedAmount = Number((amount * 100).toFixed(0));
    console.info('Пополнение баланса:', {
      email: email,
      amount: fixedAmount,
      timestamp: new Date().toISOString(),
    });
    this.store.dispatch(topUpBalanceAction({ email, amount: fixedAmount }));
  }

  /**
   * Открывает диалог для пополнения баланса
   * @param email Email пользователя
   */
  openTopUpDialog(email: string): void {
    this.selectedEmail = email;
    this.topUpAmount = null;

    // Найдем пользователя и установим заголовок с его данными
    const wallet = this.wallets.find((w) => w.email === email);
    const userInfo = wallet?.tgUserName ? wallet.tgUserName : email;
    this.modalTitle = `Пополнение баланса: ${userInfo}`;

    // Сохраняем текущий баланс пользователя
    this.currentUserBalance = wallet ? wallet.accountBalance / 100 : 0;

    this.displayTopUpModal = true;
  }

  /**
   * Подтверждает пополнение баланса
   */
  confirmTopUp(): void {
    if (this.topUpAmount && this.selectedEmail) {
      this.topUpBalance(this.selectedEmail, this.topUpAmount);
      this.displayTopUpModal = false;
      this.topUpAmount = null;
      this.selectedEmail = '';
    }
  }

  /**
   * Открывает диалог для отправки личного сообщения
   * @param email Email пользователя
   * @param tgUserName Имя пользователя в Telegram
   */
  openMessageDialog(email: string, tgUserName?: string): void {
    this.selectedUserEmail = email;
    this.messageText = '';

    const userInfo = tgUserName ? `${tgUserName} (${email})` : email;
    this.selectedUserInfo = userInfo;
    this.messageModalTitle = `Отправить сообщение пользователю`;

    this.displayMessageModal = true;
  }

  /**
   * Подтверждает отправку сообщения
   */
  confirmSendMessage(): void {
    if (this.messageText && this.messageText.trim() && this.selectedUserEmail) {
      this.sendPersonalMessage(this.selectedUserEmail, this.messageText.trim());
      this.displayMessageModal = false;
      this.messageText = '';
      this.selectedUserEmail = '';
      this.selectedUserInfo = '';
    }
  }

  /**
   * Устанавливает шаблонное сообщение в поле ввода
   * @param template Текст шаблонного сообщения
   */
  setTemplateMessage(template: string): void {
    this.messageText = template;
  }

  /**
   * Отправляет личное сообщение пользователю
   * @param email Email пользователя
   * @param message Текст сообщения
   */
  private sendPersonalMessage(email: string, message: string): void {
    console.info('Отправка личного сообщения:', {
      email: email,
      message: message,
      timestamp: new Date().toISOString(),
    });

    this.adminService.sendPersonalMessage(email, message).subscribe(
      (response: any) => {
        if (response.status) {
          this.messageService.add({
            severity: 'success',
            summary: 'Успех',
            detail: `Сообщение успешно отправлено пользователю ${email}`,
            life: 5000,
          });
        } else {
          this.messageService.add({
            severity: 'error',
            summary: 'Ошибка',
            detail: `Не удалось отправить сообщение пользователю ${email}`,
            life: 10000,
          });
        }
      },
      (error: any) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Ошибка',
          detail: `Не удалось отправить сообщение пользователю ${email}`,
          life: 10000,
        });
        console.error('Ошибка при отправке сообщения', error);
      }
    );
  }

  /**
   * Метод для снятия средств с баланса кошелька
   * @param email Email пользователя
   * @param amount Сумма снятия
   */
  withdrawRefBalance(email: string, amount: number): void {
    console.info('Снятие средств:', {
      email: email,
      amount: amount,
      timestamp: new Date().toISOString(),
    });
    this.store.dispatch(withdrawRefBalanceAction({ email, amount }));
  }

  formatMoneyInput(input: HTMLInputElement) {
    if (!input || !input.value) return;
    const value = parseFloat(input.value);
    input.value = value.toFixed(2);
  }

  public showWalletDetails(email: string): void {
    const wallet = this.wallets.find((w) => w.email === email);
    if (!wallet) return;

    this.selectedWalletDetailsEmail = email;
    this.selectedWalletDetailsUser = wallet.tgUserName || 'No tg user';
    this.selectedWalletDetailsBalance = wallet.accountBalance / 100;
    this.walletDetailsModalTitle = `Детальная информация - ${email}`;
    this.displayWalletDetailsModal = true;

    // Загружаем данные через action
    this.store.dispatch(getWalletDetailsAction({ email }));
  }

  /**
   * Открывает модальное окно с отчетом пользователя
   * @param email Email пользователя
   */
  public showUserCommissionReport(email: string): void {
    const wallet = this.wallets.find((w) => w.email === email);
    if (!wallet) return;

    this.currentReportEmail = email;
    const userInfo = wallet.tgUserName
      ? `${wallet.tgUserName} (${email})`
      : email;
    this.reportsModalTitle = `Отчет пользователя - ${userInfo}`;
    this.displayReportsModal = true;

    // Загружаем отчет через action
    this.store.dispatch(getUserCommissionReportAction({ email }));
  }

  /**
   * Возвращает данные для отправки отчета без парсинга
   */
  private getReportData(): {
    startDate: number;
    endDate: number;
    earnings: number;
    commission: number;
  } {
    // Используем дефолтные данные без парсинга
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    return {
      startDate: Math.floor(startOfMonth.getTime() / 1000),
      endDate: Math.floor(endOfMonth.getTime() / 1000),
      earnings: 0,
      commission: 0,
    };
  }

  /**
   * Отправляет отчет пользователю
   */
  public sendReportToUser(): void {
    console.log('=== ОТПРАВКА ОТЧЕТА ===');
    console.log('currentReportEmail:', this.currentReportEmail);

    if (!this.currentReportEmail) {
      console.log('❌ Отсутствует email для отправки');
      this.messageService.add({
        severity: 'warn',
        summary: 'Внимание',
        detail: 'Не указан email пользователя',
        life: 3000,
      });
      return;
    }

    console.log('📤 Отправляем отчет:', this.currentReportEmail);
    this.adminService.sendWalletReport(this.currentReportEmail).subscribe(
      (response: any) => {
        console.log('📨 Ответ сервера:', response);
        if (response.status) {
          console.log('✅ Отчет успешно отправлен');
          this.messageService.add({
            severity: 'success',
            summary: 'Успех',
            detail: `Отчет успешно отправлен пользователю ${this.currentReportEmail}`,
            life: 5000,
          });
        } else {
          console.log('❌ Сервер вернул status: false');
          this.messageService.add({
            severity: 'error',
            summary: 'Ошибка',
            detail: `Не удалось отправить отчет пользователю ${this.currentReportEmail}`,
            life: 10000,
          });
        }
      },
      (error: any) => {
        console.error('❌ Ошибка HTTP запроса:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Ошибка',
          detail: `Не удалось отправить отчет пользователю ${this.currentReportEmail}`,
          life: 10000,
        });
      }
    );
  }

  /**
   * Открывает предпросмотр PDF файла
   */
  public previewReportPdf(): void {
    if (this.reportPdfUrl) {
      // Если есть URL, открываем в новом окне
      window.open(this.reportPdfUrl, '_blank');
    } else if (this.reportPdfBase64) {
      // Если есть base64, создаем blob и открываем
      try {
        const byteCharacters = atob(this.reportPdfBase64);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        window.open(url, '_blank');
        // Освобождаем память через некоторое время
        setTimeout(() => URL.revokeObjectURL(url), 1000);
      } catch (error) {
        this.messageService.add({
          severity: 'error',
          summary: 'Ошибка',
          detail: 'Не удалось открыть PDF файл',
          life: 5000,
        });
        console.error('Ошибка при открытии PDF:', error);
      }
    } else {
      this.messageService.add({
        severity: 'warn',
        summary: 'Внимание',
        detail: 'PDF файл недоступен',
        life: 3000,
      });
    }
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
