import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, from, of, switchMap } from 'rxjs';
import { ApiCreate } from 'src/app/page/types/apiCreate.interface';
import { environment } from 'src/environments/environment';
import { CurrentUserApi } from '../types/userInfo.interface';
import { EditApi } from '../store/actions/editApi.action';
import { GetterResponseInterface } from 'src/app/shared/types/response.interface';
import {
  NewReport,
  RefInfo,
  Report,
  Transaction,
  WalletBalance,
} from '../types/page.interface';
import { PersistanceService } from 'src/app/shared/services/persistance.service';
import { EmptyUser } from 'src/app/shared/types/emptyUsersResponse.interface.interface';

interface UserResponseInterface {
  errors?: string[];
  messages?: string[];
  status: boolean;
  data?: string[] | string | null;
}

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(
    private http: HttpClient,
    private persistanceService: PersistanceService
  ) {}
  createApi({
    key,
    secret,
    email,
    apiName,
    exchange,
  }: ApiCreate): Observable<UserResponseInterface> {
    const url = environment.apiUrl + '/createApi';
    const data = {
      key,
      secret,
      email,
      name: apiName,
      exchange,
    };
    return this.http.post<GetterResponseInterface<string>>(url, data);
  }

  addExistingApi({
    key,
    secret,
    email,
    apiName,
    exchange,
  }: ApiCreate): Observable<UserResponseInterface> {
    const url = environment.apiUrl + '/addExistingApi';
    const data = {
      key,
      secret,
      email,
      name: apiName,
      exchange,
    };
    return this.http.post<GetterResponseInterface<string>>(url, data);
  }

  editApi({
    key,
    secret,
    email,
    apiName,
    apiId,
  }: EditApi): Observable<UserResponseInterface> {
    const url = environment.apiUrl + '/editApi';
    const data = {
      key,
      secret,
      email,
      name: apiName,
      apiId,
    };
    return this.http.post<GetterResponseInterface<string>>(url, data);
  }

  getUserInfo(email: string) {
    const url = environment.apiUrl + '/getAllApi';
    const data = {
      email,
    };
    return this.http.post<GetterResponseInterface<CurrentUserApi[]>>(url, data);
  }

  getEmptyUsers() {
    const url = environment.apiUrl + '/api/getEmptyUsers';
    const token = this.persistanceService.get('accessToken');
    const headers = {
      Authorization: `Bearer ${token}`,
    };
    return this.http.get<GetterResponseInterface<EmptyUser[]>>(url, {
      headers,
    });
  }

  getAllStatuses(email: string) {
    const url = environment.apiUrl + '/getAllStatuses';
    const data = {
      email,
    };
    return this.http.post<GetterResponseInterface<CurrentUserApi[]>>(url, data);
  }

  deleteApi(email: string, apiId: string): Observable<UserResponseInterface> {
    const url = environment.apiUrl + '/deleteApi';
    const data = {
      apiId,
      email,
    };
    return this.http.post<GetterResponseInterface<string>>(url, data);
  }

  startBot(email: string, apiId: string): Observable<UserResponseInterface> {
    const url = environment.apiUrl + '/startBot';
    const data = {
      email,
      apiId,
    };
    return this.http.post<GetterResponseInterface<null>>(url, data);
  }

  stopBot(email: string, apiId: string): Observable<UserResponseInterface> {
    const url = environment.apiUrl + '/stopBot';
    const data = {
      email,
      apiId,
    };
    return this.http.post<GetterResponseInterface<null>>(url, data);
  }

  fullStopBot(email: string, apiId: string): Observable<UserResponseInterface> {
    const url = environment.apiUrl + '/fullStopBot';
    const data = {
      email,
      apiId,
    };
    return this.http.post<GetterResponseInterface<null>>(url, data);
  }

  getReports(fromDate: number, toDate: number, email: string | null) {
    const url = environment.apiUrl + '/api/getReports';
    const token = this.persistanceService.get('accessToken');
    const headers = {
      Authorization: email == null ? `Bearer ${token}` : '',
    };
    const data = { from: fromDate, to: toDate, email };
    return this.http.post<GetterResponseInterface<Report[]>>(url, data, {
      headers,
    });
  }

  getNewPnlReports(fromDate: number, toDate: number, email: string | null) {
    const url = environment.apiUrl + '/api/getPnlReports';
    const token = this.persistanceService.get('accessToken');
    const headers = {
      Authorization: email == null ? `Bearer ${token}` : '',
    };
    const data = { from: fromDate, to: toDate, email };
    return this.http.post<GetterResponseInterface<NewReport[]>>(url, data, {
      headers,
    });
  }

  getClearPnlReportsWithoutDoubts(fromDate: number, toDate: number) {
    const url = environment.apiUrl + `/api/getClearPnlReportsWithoutDoubts`;
    const token = this.persistanceService.get('accessToken');
    const headers = {
      Authorization: `Bearer ${token}`,
    };
    return this.http.post<GetterResponseInterface<NewReport[]>>(
      url,
      {
        from: fromDate,
        to: toDate,
      },
      {
        headers,
      }
    );
  }

  getPnlReports(fromDate: number, toDate: number, email: string | null) {
    const url = environment.apiUrl + '/api/getPnlReports';
    const token = this.persistanceService.get('accessToken');
    const headers = {
      Authorization: email == null ? `Bearer ${token}` : '',
    };
    const data = { from: fromDate, to: toDate, email };
    return this.http.post<GetterResponseInterface<Report[]>>(url, data, {
      headers,
    });
  }

  getRefs(accountId: string) {
    const url = environment.apiUrl + '/api/getTgInfoByRefId/' + accountId;
    return this.http.get<GetterResponseInterface<RefInfo[][]>>(url);
  }

  getWallets(): Observable<GetterResponseInterface<WalletBalance[]>> {
    const url = environment.apiUrl + '/admin/getWallets';
    const token = this.persistanceService.get('accessToken');
    const headers = {
      Authorization: `Bearer ${token}`,
    };
    return this.http.get<GetterResponseInterface<WalletBalance[]>>(url, {
      headers,
    });
  }

  getWalletHistory(
    email: string
  ): Observable<GetterResponseInterface<Transaction[]>> {
    const url = environment.apiUrl + '/admin/getWalletHistory';
    const token = this.persistanceService.get('accessToken');
    const headers = {
      Authorization: `Bearer ${token}`,
    };
    const data = { email };
    return this.http.post<GetterResponseInterface<any[]>>(url, data, {
      headers,
    });
  }

  // New methods for PNL reports users and solo reports
  getPnlReportsUsers(fromDate: number, toDate: number) {
    const url = environment.apiUrl + '/api/getPnlReportsUsers';
    const token = this.persistanceService.get('accessToken');
    const headers = {
      Authorization: `Bearer ${token}`,
    };
    const data = { from: fromDate, to: toDate };
    return this.http.post<GetterResponseInterface<{ username: string }[]>>(
      url,
      data,
      {
        headers,
      }
    );
  }

  getSoloPnlReportsWithoutDoubts(
    fromDate: number,
    toDate: number,
    username: string
  ) {
    const url =
      environment.apiUrl + '/api/getSoloPnlReportsWithoutDoubtsByUsername';
    const token = this.persistanceService.get('accessToken');
    const headers = {
      Authorization: `Bearer ${token}`,
    };
    const data = { from: fromDate, to: toDate, username };
    return this.http.post<GetterResponseInterface<NewReport[]>>(url, data, {
      headers,
    });
  }
}
