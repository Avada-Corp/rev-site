import { Component, Input } from '@angular/core';
import { WalletCommission } from 'src/app/page/types/page.interface';

@Component({
  selector: 'app-wallet-manual-transactions-tab',
  templateUrl: './wallet-manual-transactions-tab.component.html',
  styleUrls: ['./wallet-manual-transactions-tab.component.scss'],
})
export class WalletManualTransactionsTabComponent {
  @Input() selectedWalletManualTransactions: WalletCommission[] = [];

  formatExplanation(explanation: string): string {
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
        console.error('manual Ошибка при парсинге JSON в описании:', e);
      }
    }

    // Если не удалось распарсить или это не JSON, возвращаем исходный текст
    return explanation;
  }

  getSortedTransactions(): WalletCommission[] {
    return [...this.selectedWalletManualTransactions].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  }
}
