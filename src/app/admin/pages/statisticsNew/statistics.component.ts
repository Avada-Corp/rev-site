import { Component, OnInit, SimpleChanges } from '@angular/core';
import { Action, Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';
import {
  FullPnlReport,
  FullReport,
  NewReport,
  Report,
} from 'src/app/page/types/page.interface';
import { reportsSelector } from '../../store/selectors';
import { getReportsAction } from '../../store/actions/getReports.action';
import { clearRefsAction } from 'src/app/page/store/actions/getRefs.action';
import { ControlApiService } from '../../services/controlApi.service';
import { ApiWithEmail } from '../../store/types/adminState.interface';

@Component({
  selector: 'app-page',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.scss'],
})
export class StatisticsComponent implements OnInit {
  private reports$: Observable<NewReport[]>;
  public reports: NewReport[] = [];
  public fullReports: FullPnlReport[] = [];
  isControlBtns: boolean = false;
  curReport: Report | null = null;
  isEditForm: boolean = false;

  constructor(
    private store: Store,
    public controlApiService: ControlApiService
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
    this.initializeValues();
    this.subscribe();
        this.controlApiService.init(true);
  }

  private initializeValues() {
    this.reports$ = this.store.pipe(select(reportsSelector));
  }

  private subscribe() {
    this.reports$.subscribe((reports) => {
      console.log('subscribe reports: ', reports);
      this.reports = reports;
      this.prepareReports(reports);
    });
  }

  private prepareReports(reports: NewReport[]) {
    const res: Record<
      string,
      Record<string, Array<Omit<NewReport, 'username' | 'keyId' | 'apiName'>>>
    > = {};
    reports.forEach((r) => {
      const {
        username,
        apiName,
        start,
        to,
        transfers,
        totalBalance,
        pnl,
        tgAccount,
        api,
        pnlDaily,
        keyId,
      } = r;
      const uniqueApiName = `${apiName}@%${keyId}`;
      if (res[username] == null) {
        res[username] = {};
      }
      if (res[username][uniqueApiName] == null) {
        res[username][uniqueApiName] = [];
      }
      res[username][uniqueApiName].push({
        start,
        to,
        transfers,
        totalBalance,
        pnl,
        tgAccount,
        api,
        pnlDaily,
      });
    });
    this.fullReports = [];
    for (const username of Object.keys(res)) {
      for (const apiName of Object.keys(res[username])) {
        const reports = res[username][apiName].sort(
          (a, b) => a.start - b.start
        );
        const lastReport = reports[reports.length - 1];
        const firstReport = reports[0];
        const { api, tgAccount } = firstReport;
        const pnlNow = lastReport.pnl;
        const pnlStart = firstReport.pnl;
        const pnlDaily = reports.reduce<number | null>((acc, val) => {
          const valPnl = val.pnlDaily;
          if (valPnl == null) {
            return null;
          }
          return (acc || 0) + valPnl;
        }, 0);
        const pnlDelta = pnlNow - pnlStart;
        const totalDaily = (pnlDaily || 0) + pnlDelta;
        // slice так как первые трансферы относятся ко дню перед отчетами
        // если первый не для трансфера то slice не надо
        this.fullReports.push({
          username,
          apiName: apiName.split('@')[0],
          tgAccount,
          pnl: pnlNow,
          api,
          pnlDaily,
          pnlStart,
          totalDaily,
        });
      }
    }
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

  getTotalVal(report: FullReport, field: 'pnl' | 'totalDaily') {
    const { username } = report;
    const reports = this.fullReports.filter((r) => r.username === username);
    return reports.reduce((acc, val) => {
      return acc + (val[field] || 0);
    }, 0);
  }

  getAllTotalVal(field: 'pnl' | 'totalDaily') {
    return this.fullReports.reduce((acc, val) => acc + (val[field] || 0), 0);
  }

  onOpenControlBtns(report: Report) {
    this.curReport = report;
    this.isControlBtns = true;
  }

  onHideControlBtns() {
    this.curReport = null;
    this.isControlBtns = false;
    this.store.dispatch(clearRefsAction());
  }

  getApiInfoFromReport({ apiName, api }: Report): ApiWithEmail {
    return {
      name: apiName,
      ...api,
    };
  }
  toFixed(val: number | null) {
    return val?.toFixed(2) || '';
  }
}
