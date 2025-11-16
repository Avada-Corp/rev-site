import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { WalletCommission, ApiJson } from 'src/app/page/types/page.interface';

@Component({
  selector: 'app-wallet-commissions-tab',
  templateUrl: './wallet-commissions-tab.component.html',
  styleUrls: ['./wallet-commissions-tab.component.scss'],
})
export class WalletCommissionsTabComponent implements OnChanges {
  @Input() selectedWalletCommissions: WalletCommission[] = [];

  public commissionTableData: any[] = [];

  ngOnChanges(changes: SimpleChanges): void {
    if (
      changes['selectedWalletCommissions'] &&
      this.selectedWalletCommissions
    ) {
      this.calculateCommissionTableData();
    }
  }

  private fix(value: number | null): string {
    return value?.toFixed(2) || '';
  }

  private calculateCommissionTableData(): void {
    this.commissionTableData = [...this.selectedWalletCommissions]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .map((commission) => {
        const api = this.getCurrentApi(commission);
        const jsonData = this.getJsonData(commission);
        const exp = commission.explanationData;
        const apiName = exp?.apiName || api?.apiName || 'Не найдено';
        const startBalance =
          exp?.startBalance ??
          api?.startBalance ??
          api?.totalBalanceStart ??
          jsonData?.startBalance ??
          0;
        const endBalance =
          exp?.endBalance ??
          api?.endBalance ??
          api?.totalBalance ??
          jsonData?.endBalance ??
          0;
        const pnl =
          exp?.realizedPnl ??
          api?.cumulativePnl ??
          api?.realizedPnl ??
          jsonData?.realizedPnl ??
          0;

        // Получаем startPnl и endPnl для отображения
        const startPnl = this.getStartPnlValue(commission, api);
        const endPnl = this.getEndPnlValue(commission, api);

        const unPnl = this.getUnPnlValue(commission, api);
        const earned = pnl + unPnl;
        const netProfit = earned - commission.amount / 100;
        return {
          ...commission,
          apiName,
          startBalance: this.fix(startBalance),
          endBalance: this.fix(endBalance),
          pnl: this.fix(pnl),
          startPnl: this.fix(startPnl),
          endPnl: this.fix(endPnl),
          unPnl: this.fix(unPnl),
          earned: this.fix(earned),
          netProfit: this.fix(netProfit),
        };
      });
  }

  getStartPnlValue(commission: WalletCommission, api: ApiJson | null): number {
    if (commission.explanationData != null) {
      return commission.explanationData.startPnl;
    } else if (api != null && api.startPnl != null) {
      return api.startPnl;
    } else {
      const jsonData = this.getJsonData(commission);
      return Number(jsonData?.startPnl || 0);
    }
  }

  getEndPnlValue(commission: WalletCommission, api: ApiJson | null): number {
    if (commission.explanationData != null) {
      return commission.explanationData.endPnl;
    } else if (api != null && api.endPnl != null) {
      return api.endPnl;
    } else {
      const jsonData = this.getJsonData(commission);
      return Number(jsonData?.endPnl || 0);
    }
  }

  getUnPnlValue(commission: WalletCommission, api: ApiJson | null): number {
    let result = 0;
    if (commission.explanationData != null) {
      result =
        commission.explanationData.endPnl - commission.explanationData.startPnl;
    } else if (api != null && api.endPnl != null && api.startPnl != null) {
      result = api.endPnl - api.startPnl;
    } else {
      const jsonData = this.getJsonData(commission);
      result = Number(jsonData?.endPnl || 0) - Number(jsonData?.startPnl || 0);
    }
    return result;
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

  getMonthName(commissions: WalletCommission[]): string {
    if (!commissions || commissions.length === 0) return '';
    try {
      const date = new Date(commissions[0].date);
      return date.toLocaleString('ru-RU', { month: 'long' });
    } catch (e) {
      return 'январь';
    }
  }

  getInitialBalance(): string {
    if (
      !this.selectedWalletCommissions ||
      this.selectedWalletCommissions.length === 0
    )
      return '';
    const firstCommission = this.commissionTableData[0];
    return firstCommission?.startBalance || '';
  }

  getFinalBalance(): string {
    if (
      !this.selectedWalletCommissions ||
      this.selectedWalletCommissions.length === 0
    )
      return '';
    const lastCommission =
      this.commissionTableData[this.commissionTableData.length - 1];
    return lastCommission?.endBalance || '';
  }

  getTotalPnl(): string {
    let total = 0;
    this.commissionTableData.forEach((commission) => {
      const pnlValue = this.getValueFromSpan(commission.pnl);
      total += pnlValue;
    });
    const valueClass =
      total > 0 ? 'positive-value' : total < 0 ? 'negative-value' : '';
    return `<span class="${valueClass}">${total > 0 ? '+' : ''}${total.toFixed(
      2
    )}</span>`;
  }

  getTotalUnPnl(): string {
    let total = 0;
    this.commissionTableData.forEach((commission) => {
      const unPnlValue = this.getValueFromSpan(commission.unPnl);
      total += unPnlValue;
    });
    const valueClass =
      total > 0 ? 'positive-value' : total < 0 ? 'negative-value' : '';
    return `<span class="${valueClass}">${total > 0 ? '+' : ''}${total.toFixed(
      2
    )}</span>`;
  }

  getTotalEarned(): string {
    let total = 0;
    this.commissionTableData.forEach((commission) => {
      const earnedValue = this.getValueFromSpan(commission.earned);
      total += earnedValue;
    });

    const valueClass =
      total > 0 ? 'positive-value' : total < 0 ? 'negative-value' : '';
    return `<span class="${valueClass}">${total > 0 ? '+' : ''}${total.toFixed(
      2
    )}</span>`;
  }

  getTotalCommission(): string {
    let total = 0;
    this.selectedWalletCommissions.forEach((commission) => {
      total += commission.amount / 100;
    });
    return total.toFixed(2);
  }

  getTotalNetProfit(): string {
    let total = 0;
    this.commissionTableData.forEach((commission) => {
      const netProfitValue = this.getValueFromSpan(commission.netProfit);
      total += netProfitValue;
    });
    const valueClass =
      total > 0 ? 'positive-value' : total < 0 ? 'negative-value' : '';
    return `<span class="${valueClass}">${total > 0 ? '+' : ''}${total.toFixed(
      2
    )}</span>`;
  }

  private getValueFromSpan(span: string): number {
    const value = span.match(/<span[^>]*>([^<]+)<\/span>/);
    return value ? parseFloat(value[1].replace('+', '')) : 0;
  }

  getCommissionPeriod(commission: WalletCommission): string {
    if (
      commission.explanationData != null &&
      commission.type !== 'partnerCommission'
    ) {
      const startPeriod = this.formatPeriodDate(
        commission.explanationData.startPeriod
      );
      const endPeriod = this.formatPeriodDate(
        commission.explanationData.endPeriod
      );
      return `${startPeriod}-${endPeriod}`;
    }

    // Парсинг периода для партнерских комиссий из explanation
    if (
      commission.explanation?.includes('Partner commission') &&
      commission.explanation
    ) {
      const periodMatch = commission.explanation.match(
        /period (\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z) - (\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z)/
      );
      console.log('periodMatch: ', periodMatch);
      if (periodMatch && periodMatch.length >= 3) {
        const startDate = this.formatDateString(periodMatch[1]);
        const endDate = this.formatDateString(periodMatch[2]);
        return `${startDate}-${endDate}`;
      }
    }

    const jsonData = this.getJsonData(commission);
    if (jsonData != null && jsonData.startDate && jsonData.endDate) {
      // Форматируем даты в формат дд.мм.гггг
      const startDate = this.formatDateString(jsonData.startDate.toString());
      const endDate = this.formatDateString(jsonData.endDate.toString());
      return startDate.includes('.')
        ? `${startDate}-${endDate}`
        : `${new Date(Number(startDate)).toLocaleDateString(
            'ru-RU'
          )}-${new Date(Number(endDate)).toLocaleDateString('ru-RU')}`;
    }
    // Если не удалось извлечь период, возвращаем формат даты из объекта
    return commission.date
      ? new Date(commission.date).toLocaleDateString('ru-RU')
      : '';
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

  // Метод для форматирования периодов дат (обрабатывает американский формат M/d/yyyy)
  private formatPeriodDate(dateString: string): string {
    if (!dateString) return '';

    // Проверяем американский формат M/d/yyyy или MM/dd/yyyy
    const americanDateRegex = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/;
    const match = dateString.match(americanDateRegex);

    if (match) {
      const month = match[1].padStart(2, '0');
      const day = match[2].padStart(2, '0');
      const year = match[3];
      return `${day}.${month}.${year}`;
    }

    // Если формат не американский, используем существующий метод
    return this.formatDateString(dateString);
  }

  // Вспомогательный метод для форматирования строки даты
  private formatDateString(dateString: string): string {
    try {
      // Если это строка в формате дд.мм.гггг, просто возвращаем её
      if (/^\d{2}\.\d{2}\.\d{4}$/.test(dateString)) {
        return dateString;
      }

      // Если это строка в формате дд.мм, просто возвращаем её + 2025
      if (/^\d{2}\.\d{2}$/.test(dateString)) {
        return `${dateString}.2025`;
      }

      // Обрабатываем различные форматы дат
      const date = new Date(dateString);
      if (!isNaN(date.getTime())) {
        return date.toLocaleDateString('ru-RU', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
        });
      }

      // Если формат неизвестен, возвращаем исходную строку
      return dateString;
    } catch (e) {
      console.error('Ошибка при форматировании даты:', e);
      return dateString;
    }
  }
}
