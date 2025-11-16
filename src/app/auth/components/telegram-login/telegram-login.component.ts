import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { tgLoginAction } from '../../store/actions/tgLogin.action';

@Component({
  selector: 'app-telegram-login',
  templateUrl: './telegram-login.component.html',
  styleUrls: ['./telegram-login.component.scss'],
})
export class TelegramLoginComponent implements OnInit {
  constructor(private route: ActivatedRoute, private store: Store) {}

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      const { id, refId = null } = params;
      if (id != null) {
        this.store.dispatch(tgLoginAction({ chatId: id, refId }));
      }
    });
  }
}
