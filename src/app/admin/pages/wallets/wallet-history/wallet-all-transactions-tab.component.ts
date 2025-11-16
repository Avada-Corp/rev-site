import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { ApiJson, WalletCommission } from 'src/app/page/types/page.interface';

@Component({
  selector: 'app-wallet-all-transactions-tab',
  templateUrl: './wallet-all-transactions-tab.component.html',
  styleUrls: ['./wallet-all-transactions-tab.component.scss'],
})
export class WalletAllTransactionsTabComponent implements OnChanges {
  @Input() selectedWalletCommissions: WalletCommission[] = [];
  @Input() selectedWalletManualTransactions: WalletCommission[] = [];
  @Input() selectedWalletReferralTransactions: WalletCommission[] = [];
  @Input() selectedWalletReferralWithdrawals: WalletCommission[] = [];
  @Input() selectedWalletPartnerCommissions: WalletCommission[] = [];
  @Input() selectedWalletCryptoTransactions: WalletCommission[] = [];

  public allTransactions: any[] = [];

  ngOnChanges(changes: SimpleChanges): void {
    if (
      changes['selectedWalletCommissions'] ||
      changes['selectedWalletManualTransactions'] ||
      changes['selectedWalletReferralTransactions'] ||
      changes['selectedWalletReferralWithdrawals'] ||
      changes['selectedWalletPartnerCommissions'] ||
      changes['selectedWalletCryptoTransactions']
    ) {
      this.calculateAllTransactions();
    }
  }

  private getJsonData(commission: WalletCommission): any | null {
    if (commission.explanation && commission.explanation.includes('{')) {
      const jsonMatch = commission.explanation.match(/(\{.*\})/);
      if (jsonMatch && jsonMatch.length >= 2) {
        return JSON.parse(jsonMatch[1]);
      }
    }
    return null;
  }

  getCurrentApi(commission: WalletCommission): ApiJson | null {
    const jsonData = this.getJsonData(commission);
    const apis = jsonData?.apis || [];
    return (
      apis.find((api: any) => {
        return Math.abs(api.commission * 100 - commission.amount) < 2;
      }) || null
    );
  }

  private calculateAllTransactions(): void {
    const allData: any[] = [];

    // Добавляем комиссии
    this.selectedWalletCommissions.forEach((commission) => {
      const api = this.getCurrentApi(commission);
      allData.push({
        date: new Date(commission.date),
        amount: -commission.amount / 100,
        type: 'commission',
        description: 'Комиссия',
        apiName: commission.explanationData?.apiName || api?.apiName || '----',
      });
    });

    // Добавляем ручные транзакции
    this.selectedWalletManualTransactions.forEach((transaction) => {
      allData.push({
        date: new Date(transaction.date),
        amount: transaction.amount / 100,
        type: 'manual',
        description: this.formatExplanation(transaction.explanation),
      });
    });

    // Добавляем реферальные транзакции
    this.selectedWalletReferralTransactions.forEach((transaction) => {
      allData.push({
        date: new Date(transaction.date),
        amount: transaction.amount / 100,
        type: 'referral',
        description: this.formatExplanation(transaction.explanation),
      });
    });

    // Добавляем реферальные транзакции
    console.log(
      'this.selectedWalletReferralWithdrawals: ',
      this.selectedWalletReferralWithdrawals
    );
    this.selectedWalletReferralWithdrawals.forEach((transaction) => {
      allData.push({
        date: new Date(transaction.date),
        amount: -transaction.amount / 100,
        type: 'referralWithdrawal',
        description: this.formatExplanation(transaction.explanation),
      });
    });

    // Добавляем партнерские комиссии
    this.selectedWalletPartnerCommissions.forEach((commission) => {
      const api = this.getCurrentApi(commission);
      allData.push({
        date: new Date(commission.date),
        amount: -commission.amount / 100,
        type: 'partnerCommission',
        description: 'Партнерская комиссия',
        apiName: commission.explanationData?.apiName || api?.apiName || '----',
      });
    });

    // Добавляем криптокошелек транзакции
    this.selectedWalletCryptoTransactions.forEach((transaction) => {
      allData.push({
        date: new Date(transaction.date),
        amount: transaction.amount / 100,
        type: 'cryptoWallet',
        description: this.formatExplanation(transaction.explanation),
      });
    });

    // Рассчитываем итоговый баланс
    let runningBalance = 0;
    this.allTransactions = [];
    this.allTransactions = allData
      .sort((a, b) => a.date.getTime() - b.date.getTime())
      .map((transaction) => {
        const isPositive = transaction.amount >= 0;
        const deposit = isPositive ? transaction.amount : 0;
        const withdrawal = isPositive ? 0 : transaction.amount;
        runningBalance += transaction.amount;
        return {
          date: transaction.date.getTime() + allData.indexOf(transaction),
          deposit: deposit,
          withdrawal: withdrawal,
          runningBalance: runningBalance,
          description: transaction.description,
          type: transaction.type,
          apiName: transaction.apiName,
        };
      })
      .sort((a, b) => -a.date + b.date);
  }

  private formatExplanation(explanation: string): string {
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
        console.error('all Ошибка при парсинге JSON в описании:', e);
      }
    }

    // Если не удалось распарсить или это не JSON, возвращаем исходный текст
    return explanation;
  }

  getTransactionTypeText(type: string): string {
    switch (type) {
      case 'commission':
        return 'Комиссия';
      case 'manual':
        return 'Ручная транзакция - Пополнение';
      case 'referral':
        return 'Реферальная выплата';
      case 'referralWithdrawal':
        return 'Реферальная выплата - Снятие';
      case 'partnerCommission':
        return 'Партнерская комиссия';
      case 'cryptoWallet':
        return 'Пополнение криптокошелька';
      default:
        return 'Неизвестно';
    }
  }
}
