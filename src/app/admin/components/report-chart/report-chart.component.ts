import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
  AfterViewInit,
  ChangeDetectionStrategy,
} from '@angular/core';
import { NewReport } from 'src/app/page/types/page.interface';

@Component({
  selector: 'app-report-chart',
  templateUrl: './report-chart.component.html',
  styleUrls: ['./report-chart.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReportChartComponent implements OnChanges, OnInit, AfterViewInit {
  @Input() reports: NewReport[] = [];
  @Input() username: string = '';

  // Графики для каждого показателя
  totalBalanceChartData: any;
  pnlChartData: any;
  pnlDailyChartData: any;
  chartOptions: any = {};
  // Хранение обработанных данных отчетов
  processedReports: any[] = [];
  // Сгруппированные данные для графиков
  groupedReports: any[] = [];
  // Текущая группировка (1, 3, 7 дней)
  currentGrouping: number = 1;

  constructor() {}

  ngOnInit(): void {
    this.initEmptyChart();
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.initEmptyChart();
    }, 100);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['reports'] && !changes['reports'].firstChange) {
      // Проверка на актуальные изменения данных
      const prevReports = changes['reports'].previousValue;
      const currentReports = changes['reports'].currentValue;

      if (JSON.stringify(prevReports) === JSON.stringify(currentReports)) {
        return;
      }
    }
    // Небольшая задержка для обеспечения корректного рендеринга
    if (this.reports && this.reports.length > 0) {
      this.processReports();
      this.createCharts();
    } else {
      console.info('No reports data available');
      this.initEmptyChart();
    }
  }

  // Инициализация пустого графика
  private initEmptyChart(): void {
    this.chartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      animation: {
        duration: 500,
      },
      plugins: {
        legend: {
          display: true,
          position: 'top',
          labels: {
            boxWidth: 20,
            font: {
              size: 12,
            },
          },
        },
        tooltip: {
          enabled: true,
          mode: 'index',
          intersect: false,
        },
      },
      scales: {
        x: {
          display: true,
          ticks: {
            font: {
              size: 11,
            },
          },
        },
        y: {
          display: true,
          beginAtZero: false,
          ticks: {
            font: {
              size: 11,
            },
          },
        },
      },
    };
  }

  private processReports(): void {
    try {
      if (!this.reports || this.reports.length === 0) {
        console.info('No reports to process');
        this.processedReports = [];
        this.groupedReports = [];
        return;
      }

      // Сортируем отчеты по дате
      this.processedReports = [...this.reports].sort((a, b) => {
        const dateA = a.to ? new Date(a.to).getTime() : 0;
        const dateB = b.to ? new Date(b.to).getTime() : 0;
        return dateA - dateB;
      });

      // Группируем данные согласно текущей настройке
      this.groupDataByPeriod();
    } catch (error) {
      console.error('Error in processReports:', error);
      this.processedReports = [];
      this.groupedReports = [];
    }
  }

  private getChart(key: string, label: string): any {
    try {
      if (!this.groupedReports || this.groupedReports.length === 0) {
        console.info('No data for chart');
        return;
      }

      const labels = this.groupedReports.map((report) => {
        const date = report.to ? new Date(report.to) : null;

        if (this.currentGrouping === 1) {
          return date ? date.toLocaleDateString() : 'Неизвестно';
        }

        // Для группированных данных показываем период
        const startDate = report.groupStartDate
          ? new Date(report.groupStartDate)
          : date;
        const endDate = report.groupEndDate
          ? new Date(report.groupEndDate)
          : date;

        if (startDate && endDate && this.currentGrouping > 1) {
          return `${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}`;
        }

        return date ? date.toLocaleDateString() : 'Неизвестно';
      });

      // Получаем данные для графика из сгруппированных данных
      const chartData = this.groupedReports.map((report) => report[key] || 0);

      return {
        labels: labels,
        datasets: [
          {
            label: `${label} (группировка ${this.currentGrouping}${
              this.currentGrouping === 1
                ? ' день'
                : this.currentGrouping <= 4
                ? ' дня'
                : ' дней'
            })`,
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: 'rgb(75, 192, 192)',
            borderWidth: 2,
            fill: true,
            tension: 0.4,
            data: chartData,
          },
        ],
      };
    } catch (error) {
      console.error('Error creating chart:', error);
      this.initEmptyChart();
    }
  }

  private createCharts(): void {
    this.totalBalanceChartData = this.getChart('totalBalance', 'Общий баланс');
    this.pnlDailyChartData = this.getChart('pnlDaily', 'Ежедневный PNL');
    this.pnlChartData = this.getChart('pnl', 'PNL');
  }

  toFixed(val: number | null): string {
    if (val === null || isNaN(val)) return '0.00';
    return val.toFixed(2);
  }

  getTotalBalanceInfo(report: NewReport): string {
    // Get the current report's index in the processed reports array
    const reportIndex = this.processedReports.findIndex(
      (r) =>
        r.keyId === report.keyId &&
        r.to === report.to &&
        r.apiName === report.apiName
    );

    // Format the current balance
    const currentBalance = this.toFixed(report.totalBalance);

    // If this is the first report or the report was not found, just return the balance
    if (reportIndex <= 0 || reportIndex === -1) {
      return currentBalance;
    }

    // Get the previous report with the same API and calculate difference
    const previousReport = this.processedReports[reportIndex - 1];
    const diff =
      (report.totalBalance || 0) - (previousReport.totalBalance || 0);

    // Format difference with color and sign
    const formattedDiff =
      diff !== 0
        ? `<span style="color: ${diff > 0 ? 'green' : 'red'}">(${
            diff > 0 ? '+' : ''
          }${this.toFixed(diff)})</span>`
        : '';

    return `${currentBalance} ${formattedDiff}`;
  }

  getDeltaInfo(report: NewReport): string {
    // Get current report values
    const pnlDaily = report.pnlDaily || 0;
    const currentPnl = report.pnl || 0;

    // Get the report index
    const reportIndex = this.processedReports.findIndex(
      (r) =>
        r.keyId === report.keyId &&
        r.to === report.to &&
        r.apiName === report.apiName
    );

    // If first report or not found in processed reports
    if (reportIndex <= 0 || reportIndex === -1) {
      // Just return pnlDaily + pnl for the first report
      return this.toFixed(pnlDaily + currentPnl);
    }

    // Get previous report with the same API
    const previousReport = this.processedReports[reportIndex - 1];
    const previousPnl = previousReport.pnl || 0;

    // Calculate delta: pnlDaily - currentPnl + previousPnl
    const delta = pnlDaily + currentPnl - previousPnl;

    return this.toFixed(delta);
  }

  // Установка группировки данных
  setGrouping(days: number): void {
    if (this.currentGrouping === days) {
      return; // Нет изменений
    }

    this.currentGrouping = days;

    // Перегруппируем данные и обновляем графики
    this.groupDataByPeriod();
    this.createCharts();
  }

  // Группировка данных по указанному периоду
  private groupDataByPeriod(): void {
    if (!this.processedReports || this.processedReports.length === 0) {
      this.groupedReports = [];
      return;
    }

    if (this.currentGrouping === 1) {
      // Если группировка по 1 дню, просто копируем данные
      this.groupedReports = [...this.processedReports];
      return;
    }

    try {
      const grouped = [];
      const period = this.currentGrouping;

      for (let i = 0; i < this.processedReports.length; i += period) {
        const group = this.processedReports.slice(i, i + period);

        if (group.length === 0) continue;

        // Берем последнюю дату группы для отображения
        const lastReport = group[group.length - 1];
        const firstReport = group[0];

        // Агрегируем данные по группе
        const groupedReport = {
          ...lastReport, // Берем структуру последнего отчета
          to: lastReport.to, // Дата - последняя в группе
          totalBalance: this.calculateGroupAverage(group, 'totalBalance'),
          pnl: this.calculateGroupAverage(group, 'pnl'),
          pnlDaily: this.calculateGroupSum(group, 'pnlDaily'),
          // Добавляем информацию о периоде
          groupPeriod: period,
          groupStartDate: firstReport.to,
          groupEndDate: lastReport.to,
          groupSize: group.length,
        };

        grouped.push(groupedReport);
      }

      this.groupedReports = grouped;
    } catch (error) {
      console.error('Error in groupDataByPeriod:', error);
      this.groupedReports = [...this.processedReports];
    }
  }

  // Вспомогательный метод для расчета среднего значения в группе
  private calculateGroupAverage(group: any[], field: string): number {
    const validValues = group
      .map((item) => item[field])
      .filter((val) => val !== null && val !== undefined && !isNaN(val));

    if (validValues.length === 0) return 0;

    return validValues.reduce((sum, val) => sum + val, 0) / validValues.length;
  }

  // Вспомогательный метод для расчета суммы в группе
  private calculateGroupSum(group: any[], field: string): number {
    return group
      .map((item) => item[field])
      .filter((val) => val !== null && val !== undefined && !isNaN(val))
      .reduce((sum, val) => sum + val, 0);
  }
}
