import { Component, Input } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { getReportsAction } from 'src/app/page/store/actions/getReports.action';
import { Observable } from 'rxjs';
import { getRefsAction } from '../../../page/store/actions/getRefs.action';
import { refInfoSelector } from 'src/app/page/store/selectors';
import { RefInfo } from 'src/app/page/types/page.interface';

@Component({
  selector: 'app-refferal-grid',
  templateUrl: './referral-grid.component.html',
  styleUrls: ['./referral-grid.component.scss'],
})
export class ReferralGridComponent {
  @Input({ alias: 'accountId', required: true }) accountId: string;
  private refs$: Observable<RefInfo[][]>;
  public refs: RefInfo[][] = [];

  constructor(private store: Store) {}

  ngOnInit() {
    this.initializeValues();
    this.subscribe();
  }

  initializeValues() {
    this.refs$ = this.store.pipe(select(refInfoSelector));
    this.store.dispatch(getRefsAction({ accountId: this.accountId }));
  }

  subscribe() {
    this.refs$.subscribe((refs) => {
      this.refs = refs;
    });
  }

  getRefDescrLevel(ref: RefInfo[]) {
    return ref.map((refEl) => refEl.tgUserName || refEl.email).join(', ');
  }
}
