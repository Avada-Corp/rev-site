import {
  Component,
  OnInit,
  SimpleChanges,
  ChangeDetectorRef,
  ChangeDetectionStrategy,
} from '@angular/core';
import { Action, Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';
import {
  FullReport,
  NewReport,
  Report,
} from 'src/app/page/types/page.interface';
import {
  reportsSelector,
  reportsDateRangeSelector,
  isReportsLoadingSelector,
  usersSelector,
} from '../../store/selectors';
import { getReportsAction } from '../../store/actions/getReports.action';
import { clearRefsAction } from 'src/app/page/store/actions/getRefs.action';
import { ControlApiService } from '../../services/controlApi.service';
import { ApiWithEmail } from '../../store/types/adminState.interface';
import { CommissionType } from '../../shared';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-page',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StatisticsComponent implements OnInit {
  private reports$: Observable<NewReport[]>;
  private reportsDateRange$: Observable<{
    fromDate: number | null;
    toDate: number | null;
  }>;
  private isReportsLoading$: Observable<boolean>;
  private users$: Observable<ApiWithEmail[]>;

  public reports: NewReport[] = [];
  public fullReports: FullReport[] = [];
  public filteredReports: FullReport[] = [];
  public reportsDateRange: { fromDate: number | null; toDate: number | null } =
    { fromDate: null, toDate: null };
  public isReportsLoading: boolean = false;

  // Индикатор обработки данных
  public isProcessingData: boolean = false;
  public processingProgress: { current: number; total: number } = {
    current: 0,
    total: 0,
  };

  isControlBtns: boolean = false;
  curReport: Report | null = null;
  isEditForm: boolean = false;
  isChartDialogVisible: boolean = false;
  currentUsername: string = '';
  currentApiKey: string = '';

  // Add commission filter options
  public commissionFilterOptions = [
    { label: 'Все', value: 'all' },
    { label: 'Недельная комиссия', value: 'weekly' },
    { label: 'Месячная комиссия', value: 'monthly' },
  ];
  public selectedCommissionFilter: string = 'all';

  // Кэш для оптимизации
  private processedReportsCache = new Map<string, FullReport[]>();
  private lastReportsHash: string = '';

  // Виртуализация для больших списков
  public virtualScrollItemSize = 50;
  public virtualScrollMinBufferPx = 200;
  public virtualScrollMaxBufferPx = 400;

  constructor(
    private store: Store,
    public controlApiService: ControlApiService,
    private cdr: ChangeDetectorRef
  ) {}

  public getLastClosedWeekDates() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const startWeekDate = new Date(today);
    const dayOfWeek = startWeekDate.getDay();
    const firstDayOfWeek = 1;
    const diff = dayOfWeek - firstDayOfWeek;
    const dateNum = startWeekDate.getDate();
    if (diff < 0) {
      startWeekDate.setDate(Math.abs(dateNum - (7 - Math.abs(diff))));
    } else {
      startWeekDate.setDate(dateNum - diff);
    }
    const endOfLastWeek = new Date(startWeekDate);
    startWeekDate.setDate(startWeekDate.getDate() - 7);
    return [startWeekDate, endOfLastWeek];
  }

  public getReports(start: number, to: number, email: string | null): Action {
    return getReportsAction({ start, to, email });
  }

  ngOnInit() {
    console.log('StatisticsComponent ngOnInit: ');
    this.initializeValues();
    console.log('1');
    this.subscribe();
    console.log('2');
    this.controlApiService.init();
    console.log('3');
    this.loadUsersAndFilter();
    console.log('4');
  }

  private initializeValues() {
    this.reports$ = this.store.pipe(select(reportsSelector));
    this.reportsDateRange$ = this.store.pipe(select(reportsDateRangeSelector));
    this.isReportsLoading$ = this.store.pipe(select(isReportsLoadingSelector));
    this.users$ = this.store.pipe(select(usersSelector));
  }

  private subscribe() {
    this.reports$.subscribe((reports) => {
      this.reports = reports;
      this.prepareReportsAsync(reports);
    });

    this.reportsDateRange$.subscribe((dateRange) => {
      this.reportsDateRange = dateRange;
    });

    this.isReportsLoading$.subscribe((isLoading) => {
      this.isReportsLoading = isLoading;
    });

    // Подписываемся на загрузку пользователей для фильтрации
    this.users$.subscribe((users) => {
      if (users && users.length > 0 && this.fullReports.length > 0) {
        this.filterReportsByCommission();
      }
    });
  }

  private loadUsersAndFilter() {
    console.log('@@@@@@@@@loadUsersAndFilter: ');
    // Загружаем пользователей для фильтрации по комиссиям
    this.controlApiService.loadUsers();
  }

  private prepareReportsAsync(reports: NewReport[]) {
    // Проверяем кэш
    const reportsHash = this.generateReportsHash(reports);
    if (
      reportsHash === this.lastReportsHash &&
      this.processedReportsCache.has(reportsHash)
    ) {
      this.fullReports = this.processedReportsCache.get(reportsHash) || [];
      this.filterReportsByCommission();
      return;
    }

    // Показываем индикатор обработки
    this.isProcessingData = true;
    this.cdr.detectChanges();

    // Разбиваем обработку на части для избежания блокировки UI
    setTimeout(() => {
      this.prepareReports(reports);
    }, 0);
  }

  private generateReportsHash(reports: NewReport[]): string {
    // Простой хеш для проверки изменений
    return (
      reports.length +
      '_' +
      reports.map((r) => r.username + r.apiName + r.start).join('_')
    );
  }

  private prepareReports(reports: NewReport[]) {
    // Оптимизированная версия с предварительным группированием
    const userGroups = new Map<string, Map<string, NewReport[]>>();

    // Первый проход - группировка данных
    for (const report of reports) {
      const { username, apiName, keyId } = report;
      const uniqueApiName = `${apiName}@%${keyId}`;

      if (!userGroups.has(username)) {
        userGroups.set(username, new Map());
      }

      const userApis = userGroups.get(username)!;
      if (!userApis.has(uniqueApiName)) {
        userApis.set(uniqueApiName, []);
      }

      userApis.get(uniqueApiName)!.push(report);
    }

    // Второй проход - обработка групп
    this.fullReports = [];
    const batchSize = 10; // Обрабатываем по 10 пользователей за раз
    let processedCount = 0;
    const userEntries = Array.from(userGroups.entries());

    // Устанавливаем общее количество пользователей
    this.processingProgress.total = userEntries.length;
    this.processingProgress.current = 0;

    for (let i = 0; i < userEntries.length; i++) {
      const [username, userApis] = userEntries[i];

      // Обрабатываем все API для одного пользователя
      for (const [apiName, apiReports] of userApis) {
        const processedReport = this.processApiReports(
          username,
          apiName,
          apiReports
        );
        if (processedReport) {
          this.fullReports.push(processedReport);
        }
      }

      processedCount++;
      this.processingProgress.current = processedCount;

      // Если обработали достаточно пользователей, даем UI время на обновление
      if (processedCount % batchSize === 0) {
        this.cdr.detectChanges();
        // Небольшая пауза для UI
        setTimeout(() => {
          this.continueProcessing(userEntries, batchSize, processedCount);
        }, 10);
        return;
      }
    }

    // Завершаем обработку
    this.finishProcessing();
  }

  private continueProcessing(
    userEntries: [string, Map<string, NewReport[]>][],
    batchSize: number,
    startCount: number
  ) {
    let processedCount = startCount;

    for (let i = startCount; i < userEntries.length; i++) {
      const [username, userApis] = userEntries[i];

      // Обрабатываем все API для одного пользователя
      for (const [apiName, apiReports] of userApis) {
        const processedReport = this.processApiReports(
          username,
          apiName,
          apiReports
        );
        if (processedReport) {
          this.fullReports.push(processedReport);
        }
      }

      processedCount++;
      this.processingProgress.current = processedCount;

      if (processedCount % batchSize === 0) {
        this.cdr.detectChanges();
        setTimeout(() => {
          this.continueProcessing(userEntries, batchSize, processedCount);
        }, 10);
        return;
      }
    }

    this.finishProcessing();
  }

  private processApiReports(
    username: string,
    apiName: string,
    reports: NewReport[]
  ): FullReport | null {
    if (reports.length === 0) return null;

    const sortedReports = reports.sort((a, b) => a.start - b.start);
    const lastReport = sortedReports[sortedReports.length - 1];
    const firstReport = sortedReports[0];
    const { api, tgAccount } = firstReport;

    const isTransferHistoryAvailable =
      firstReport.transfers != null && lastReport.transfers != null;
    const totalBalanceNow = lastReport.totalBalance;
    const pnlNow = lastReport.pnl;
    const avalBalanceNow = totalBalanceNow + pnlNow;
    const totalBalanceStart = firstReport.totalBalance;
    const pnlStart = firstReport.pnl;

    let pnlDaily = sortedReports.reduce<number | null>((acc, val) => {
      const valPnl = val.pnlDaily;
      if (valPnl == null) {
        return null;
      }
      return (acc || 0) + valPnl;
    }, 0);

    if (sortedReports[0]?.to === this.reportsDateRange.fromDate) {
      pnlDaily =
        pnlDaily == null ? null : pnlDaily - sortedReports[0]?.pnlDaily;
    }

    const avalBalanceStart = totalBalanceStart + pnlStart;
    const pnlDelta = pnlNow - pnlStart;
    const totalDaily = pnlDaily == null ? null : pnlDaily + pnlDelta;

    // Используем опциональное поле notForTransferCount, если оно есть
    const isNotForSlice =
      (sortedReports[0] as any).notForTransferCount || false;
    const transfers = sortedReports
      .filter((r) => !(r as any).notForTransferCount)
      .slice(isNotForSlice ? 0 : 1, sortedReports.length)
      .reduce((acc: number, val: any) => {
        if (val.transfers == null) {
          return acc;
        }
        return (
          acc +
          val.transfers.withdrawals.reduce((a: number, b: number) => a + b, 0) -
          val.transfers.deposits.reduce((a: number, b: any) => a + b, 0)
        );
      }, 0);

    return {
      username,
      apiName: apiName.split('@')[0],
      tgAccount,
      avalBalance: avalBalanceNow,
      totalBalance: totalBalanceNow,
      pnl: pnlNow,
      transfers,
      total: avalBalanceNow - avalBalanceStart + transfers,
      api,
      pnlDaily,
      avalBalanceStart,
      totalBalanceStart,
      pnlStart,
      totalDaily,
      isTransferHistoryAvailable,
    };
  }

  private finishProcessing() {
    console.log('this.fullReports@@: ', this.fullReports);

    // Сохраняем в кэш
    const reportsHash = this.generateReportsHash(this.reports);
    this.processedReportsCache.set(reportsHash, [...this.fullReports]);
    this.lastReportsHash = reportsHash;

    this.filterReportsByCommission();

    // Скрываем индикатор обработки
    this.isProcessingData = false;
    this.processingProgress = { current: 0, total: 0 };
    this.cdr.detectChanges();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes?.['fullReports'] != null) {
      try {
        this.prepareReports(changes?.['fullReports'].currentValue);
      } catch (error) {
        console.error('ngOnChanges error: ', error);
      }
    }
  }

  // Кэш для вычислений
  private totalValCache = new Map<string, number>();
  private allTotalValCache = new Map<string, number>();

  getTotalVal(
    report: FullReport,
    field:
      | 'totalBalance'
      | 'total'
      | 'pnl'
      | 'transfers'
      | 'pnlDaily'
      | 'totalDaily'
  ) {
    const cacheKey = `${report.username}_${field}_${this.filteredReports.length}`;

    if (this.totalValCache.has(cacheKey)) {
      return this.totalValCache.get(cacheKey)!;
    }

    const { username } = report;
    const reports = this.filteredReports.filter((r) => r.username === username);
    const result = reports.reduce((acc, val) => {
      // @ts-ignore
      return acc + (val[field] || 0);
    }, 0);

    this.totalValCache.set(cacheKey, result);
    return result;
  }

  getAllTotalVal(
    field: 'totalBalance' | 'total' | 'pnl' | 'transfers' | 'totalDaily'
  ) {
    const cacheKey = `all_${field}_${this.filteredReports.length}`;

    if (this.allTotalValCache.has(cacheKey)) {
      return this.allTotalValCache.get(cacheKey)!;
    }

    if (!this.filteredReports || this.filteredReports.length === 0) {
      return 0;
    }

    const result = this.filteredReports.reduce(
      (acc, val) => acc + (val[field] || 0),
      0
    );

    this.allTotalValCache.set(cacheKey, result);
    return result;
  }

  onOpenControlBtns(report: Report) {
    console.log('report: ', report);
    this.curReport = report;
    this.isControlBtns = true;
  }

  onHideControlBtns() {
    this.curReport = null;
    this.isControlBtns = false;
    this.store.dispatch(clearRefsAction());
  }

  openChartDialog(report: FullReport, event: Event) {
    event.stopPropagation();

    // Ограничить количество отчетов, которые будут отправлены в chart component
    // const limitedReports = this.filterAndLimitReportsForChart(report);

    // Открыть диалог через setTimeout, чтобы избежать блокировки UI
    setTimeout(() => {
      this.currentUsername = report.username;
      this.currentApiKey = report.api.key;
      this.isChartDialogVisible = true;
      this.cdr.detectChanges(); // Принудительно запускаем детекцию изменений
    }, 10);
  }

  closeChartDialog() {
    this.isChartDialogVisible = false;
  }

  getFilteredReportsForCurrentApi(): NewReport[] {
    if (!this.reports || this.reports.length === 0 || !this.currentApiKey) {
      return [];
    }

    // Фильтруем отчеты для текущего API ключа и ограничиваем количество
    const filteredReports = this.reports.filter(
      (report) =>
        report.username === this.currentUsername &&
        report.api.key === this.currentApiKey
    );

    // Возвращаем все отчёты без ограничения
    return filteredReports;
  }

  getApiInfoFromReport({ apiName, api }: Report): ApiWithEmail {
    return {
      name: apiName,
      ...api,
    };
  }
  // Кэш для форматирования чисел
  private toFixedCache = new Map<number, string>();

  toFixed(val: number | null) {
    if (val === null || val === undefined) {
      return '';
    }

    // Кэшируем результат для часто используемых значений
    if (this.toFixedCache.has(val)) {
      return this.toFixedCache.get(val)!;
    }

    const result = val.toFixed(2);
    this.toFixedCache.set(val, result);
    return result;
  }
  clickRange() {
    this.reports = [];
    this.fullReports = [];
    this.filteredReports = [];
    // Очищаем кэши
    this.totalValCache.clear();
    this.allTotalValCache.clear();
    this.processedReportsCache.clear();
    this.lastReportsHash = '';
    this.toFixedCache.clear();
    this.processingProgress = { current: 0, total: 0 };
  }

  public saveReportsToFile() {
    const data = {
      fullReports: this.fullReports,
      reports: this.reports,
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'reports.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  // Add filter function for reports (used in modal)
  public filterReportsByCommission() {
    // Очищаем кэш при изменении фильтра
    this.totalValCache.clear();
    this.allTotalValCache.clear();
    this.toFixedCache.clear();

    // Если пользователи не загружены, показываем все отчеты
    if (
      !this.controlApiService.users ||
      this.controlApiService.users.length === 0
    ) {
      console.log('Users not loaded yet, showing all reports');
      this.filteredReports = [...this.fullReports];
      return;
    }

    if (this.selectedCommissionFilter === 'all') {
      this.filteredReports = [...this.fullReports];
      return;
    }

    this.filteredReports = this.fullReports.filter((report) => {
      return (
        this.getReportCommissionType(report) === this.selectedCommissionFilter
      );
    });
  }

  private getReportCommissionType(report: FullReport): CommissionType {
    const api = this.controlApiService.users.find(
      (u) => u.email === report.api.email
    );

    if (api?.commissionType) {
      return api.commissionType;
    }

    return environment.isWeeklyReportsByDefault ? 'weekly' : 'monthly';
  }

  // TrackBy функции для оптимизации рендеринга
  trackByUsername(index: number, report: FullReport): string {
    return report.username;
  }

  trackByApiName(index: number, report: FullReport): string {
    return report.username + '_' + report.apiName;
  }
}
