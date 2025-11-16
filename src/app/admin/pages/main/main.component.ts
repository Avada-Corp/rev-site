import { Component, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';
import { currentUserSelector } from 'src/app/auth/store/selectors';
import { UserRole } from 'src/app/shared/types/userRole.enum';
import { CurrentUserTokenResponseInterface } from 'src/app/shared/types/currentUserTokenResponse.interface';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-page',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
})
export class MainComponent implements OnInit {
  private user$: Observable<CurrentUserTokenResponseInterface | null>;
  public email: string = '';
  public isSuperAdmin: boolean = false;
  public isAdmin: boolean = false;
  isAdd: boolean = false;
  isShowEmpty: boolean = false;
  public isMainServer: boolean = environment.isMainServer;

  constructor(private store: Store) {}

  ngOnInit() {
    this.initializeValues();
    this.subscribe();
  }

  initializeValues() {
    this.user$ = this.store.pipe(select(currentUserSelector));
  }

  subscribe() {
    this.user$.subscribe((user) => {
      this.email = user?.email || '';
      this.isSuperAdmin = user?.userRole === UserRole.SuperAdmin;
      this.isAdmin =
        user?.userRole === UserRole.Admin ||
        user?.userRole === UserRole.SuperAdmin;
    });
  }

  toggleApiForm() {
    this.isAdd = !this.isAdd;
  }
  showEmptyApi() {
    this.isShowEmpty = true;
  }
}
