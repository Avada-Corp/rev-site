import { Component, OnInit } from '@angular/core';
import { Action, Store, select } from '@ngrx/store';
import { currentUserSelector } from 'src/app/auth/store/selectors';
import { reportsSelector } from '../store/selectors';
import { Observable, firstValueFrom, lastValueFrom } from 'rxjs';
import { Report } from '../types/page.interface';
import { getReportsAction } from '../store/actions/getReports.action';
import { CurrentUserTokenResponseInterface } from 'src/app/shared/types/currentUserTokenResponse.interface';

@Component({
  selector: 'app-stat',
  templateUrl: './stat.component.html',
  styleUrls: ['./stat.component.scss'],
})
export class StatComponent implements OnInit {
  stats$: Observable<Report[]>;
  allReports: Array<Report[]> = [];
  results: Record<string, number> = {};
  allSum: number = 0;
  email: string;
  constructor(private store: Store) {}

  public getReports(start: number, to: number, email: string | null): Action {
    return getReportsAction({ start, to, email });
  }

  async ngOnInit(): Promise<void> {
    await this.initializeValues();
    this.subscribe();
  }

  async initializeValues() {
    this.email =
      (await firstValueFrom(this.store.pipe(select(currentUserSelector))))
        ?.email || '';
    this.stats$ = this.store.pipe(select(reportsSelector));
  }
  subscribe() {
    this.stats$.subscribe((reports) => {
      this.allReports = [];
      const reportsByName: Record<string, Report[]> = {};
      reports.forEach((r) => {
        const fullData = { ...r, avalBalance: r.totalBalance + r.pnl };
        if (reportsByName[r.apiName] == null) {
          reportsByName[r.apiName] = [fullData];
        } else {
          reportsByName[r.apiName].push(fullData);
        }
      });
      for (const name of Object.keys(reportsByName)) {
        const initReport = reportsByName[name].sort(
          (a, b) => a.start - b.start
        )[0];
        const lastReport = reportsByName[name].sort(
          (a, b) => b.start - a.start
        )[0];
        const diffBalances =
          lastReport.totalBalance -
          initReport.totalBalance +
          lastReport.pnl -
          initReport.pnl;
        const transfers = reportsByName[name].reduce((acc, val) => {
          acc += val.transfers?.withdrawals.reduce((a, b) => a + b, 0) || 0;
          acc -= val.transfers?.deposits.reduce((a, b) => a + b, 0) || 0;
          return acc;
        }, 0);
        const result = diffBalances + transfers;
        this.results[name] = result;
        this.allReports.push(reportsByName[name]);
      }
      this.allSum = Object.keys(this.results).reduce(
        (acc, val) => acc + this.results[val],
        0
      );
    });
  }

  toLocale(date: number) {
    const options = { month: 'long', day: 'numeric' };
    // @ts-ignore
    return new Date(date).toLocaleDateString('en-US', options);
  }
}
