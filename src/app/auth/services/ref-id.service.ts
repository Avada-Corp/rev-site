import { Injectable } from '@angular/core';
import { Params } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root',
})
export class RefIdService {
  private refIdKey: string = 'RefId';
  private lifetimeDays: number = 30;

  constructor(private cookieService: CookieService) {}

  setCookie(val: string | null) {
    if (val == null) {
      return;
    }
    const date = new Date();
    date.setDate(date.getDate() + this.lifetimeDays);
    this.cookieService.set(this.refIdKey, val, {
      expires: date,
    });
  }

  getRefId(params: Params) {
    const cookieRefId = this.cookieService.get(this.refIdKey);
    const { refId: paramsRefId = null } = params;
    const result = cookieRefId ? cookieRefId : paramsRefId;
    if (paramsRefId === result) {
      this.setCookie(result);
    }
    return result;
  }
}
