import { Component, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';
import {
  EmptyTableUser,
  EmptyUser,
  EmptyUsersResponse,
} from 'src/app/shared/types/emptyUsersResponse.interface.interface';
import { emptyUsersSelector } from '../../store/selectors';
import { getEmptyUsersAction } from '../../store/actions/getEmptyUsers.action';
import { ControlApiService } from '../../services/controlApi.service';

function toLocale(date: any) {
  const options = { month: 'long', day: 'numeric' };
  // @ts-ignore
  return new Date(date).toLocaleDateString('en-US', options);
}

@Component({
  selector: 'app-show-empty',
  templateUrl: './show-empty.component.html',
  styleUrls: ['./show-empty.component.scss'],
})
export class ShowEmptyComponent {
  public users: EmptyTableUser[] = [];

  constructor(public controlApiService: ControlApiService) {}
}
