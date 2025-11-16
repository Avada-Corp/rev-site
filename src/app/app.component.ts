import { Component, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { getCurrentUserAction } from './auth/store/actions/getCurrentUser.action';
import { isLoadingSelector, isLoggedInSelector } from './auth/store/selectors';
import { Observable, timer } from 'rxjs';
// import { NgxSpinnerService } from 'ngx-spinner';
import { loaderCountSelector } from './page/store/selectors';
import {
  loaderCountAdminSelector,
  isReportsLoadingSelector,
} from './admin/store/selectors';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'Process starter';
  public isLoading$: Observable<number>;
  public isLoadingAdmin$: Observable<number>;
  public isAuthLoading$: Observable<boolean>;
  public isReportsLoading$: Observable<boolean>;
  public isSpinning: boolean;
  public isLoggedIn$: Observable<boolean | null>;
  private isReportsLoadingValue: boolean = false;

  constructor(
    private store: Store // private spinner: NgxSpinnerService
  ) {}

  ngOnInit(): void {
    this.initializeValues();
    this.subscribe();
    // При инициализации проверяем текущего пользователя
    // Это действие уже будет вызвано AuthGuard только если нужно
    // this.store.dispatch(getCurrentUserAction());
  }

  initializeValues() {
    this.isLoading$ = this.store.pipe(select(loaderCountSelector));
    this.isLoadingAdmin$ = this.store.pipe(select(loaderCountAdminSelector));
    this.isAuthLoading$ = this.store.pipe(select(isLoadingSelector));
    this.isReportsLoading$ = this.store.pipe(select(isReportsLoadingSelector));
    this.isLoggedIn$ = this.store.pipe(select(isLoggedInSelector));
  }
  subscribe() {
    this.isLoading$.subscribe((val) => {
      this.processSpinning(val);
    });
    this.isLoadingAdmin$.subscribe((val) => {
      this.processSpinning(val);
    });
    this.isAuthLoading$.subscribe((isLoading) => {
      if (isLoading) {
        this.isSpinning = true;
      } else {
        this.updateSpinningState();
      }
    });
    this.isReportsLoading$.subscribe((isLoading) => {
      this.isReportsLoadingValue = isLoading;
      if (isLoading) {
        this.isSpinning = true;
      } else {
        this.updateSpinningState();
      }
    });
  }

  processSpinning(val: number) {
    if (val > 0) {
      this.isSpinning = true;
      const slow$ = timer(30000);
      // TODO костыль, если какой то ответ не прилетел убрать блокировку страницы
      slow$.subscribe(() => (this.isSpinning = false));
    } else {
      this.updateSpinningState();
    }
  }

  updateSpinningState() {
    // Спиннер должен показываться если загружаются отчеты
    this.isSpinning = this.isReportsLoadingValue;
  }
}
