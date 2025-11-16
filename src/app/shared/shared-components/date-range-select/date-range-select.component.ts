import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Action, Store } from '@ngrx/store';

@Component({
  selector: 'app-date-range-select',
  templateUrl: './date-range-select.component.html',
  styleUrls: ['./date-range-select.component.scss'],
})
export class DateRangeSelectComponent implements OnInit {
  @Input({ alias: 'dispatchFunc', required: true }) dispatchFunc: (
    start: number,
    to: number,
    email: string | null
  ) => Action;
  @Input('rangeDates') initRangeDates: Date[];
  @Input('email') email: string | null = null;
  @Output() getEvent = new EventEmitter();
  rangeDates: Date[];
  constructor(private store: Store) {}

  ngOnInit(): void {
    this.rangeDates = this.initRangeDates;
    if (this.rangeDates && this.rangeDates.length > 0) {
      this.getReports();
    }
  }

  toUtc(date: Date) {
    return date.getTime() - date.getTimezoneOffset() * 60 * 1000;
  }

  toLocale(date: number | Date) {
    const options = { month: 'long', day: 'numeric' };
    // @ts-ignore
    return new Date(date).toLocaleDateString('en-US', options);
  }
  getReports() {
    this.getEvent.emit();
    const [start, to] = this.rangeDates.map((val) => this.toUtc(val));
    this.store.dispatch(this.dispatchFunc(start, to, this.email));
  }
}
