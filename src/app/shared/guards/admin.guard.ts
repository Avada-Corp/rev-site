import { Store, select } from '@ngrx/store';
import { inject } from '@angular/core';
import {
  currentUserSelector,
  isLoggedInSelector,
} from 'src/app/auth/store/selectors';
import { map, filter, switchMap, take } from 'rxjs/operators';
import {
  Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';
import { getCurrentUserAction } from 'src/app/auth/store/actions/getCurrentUser.action';
import { Observable, of } from 'rxjs';
import { UserRole } from '../types/userRole.enum';

export const adminGuard = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const store = inject(Store);
  const router = inject(Router);

  // Сохраняем URL, на который хотел перейти пользователь
  const targetUrl = state.url;

  if (targetUrl && targetUrl !== '/' && targetUrl !== '/auth/login') {
    localStorage.setItem('redirectUrl', targetUrl);
  }

  // Сначала проверяем, авторизован ли пользователь
  return store.pipe(
    select(isLoggedInSelector),
    take(1),
    switchMap((isLogged) => {
      // Если isLogged === null, значит авторизация еще не проверена,
      // отправляем запрос на получение текущего пользователя
      if (isLogged === null) {
        store.dispatch(getCurrentUserAction());

        // Ждем, пока не получим четкий ответ об авторизации (true или false)
        return store.pipe(
          select(isLoggedInSelector),
          filter((status) => status !== null),
          take(1)
        );
      }

      // Если уже есть статус авторизации, просто возвращаем его
      return of(isLogged);
    }),
    switchMap((isLogged) => {
      // Если пользователь не авторизован, перенаправляем на страницу логина
      if (!isLogged) {
        router.navigateByUrl('/auth/login');
        return of(false);
      }

      // Если пользователь авторизован, проверяем его права администратора
      return store.pipe(
        select(currentUserSelector),
        filter((user) => user !== null),
        take(1),
        map((user) => {
          if (
            user &&
            (user.userRole === UserRole.Admin ||
              user.userRole === UserRole.SuperAdmin)
          ) {
            return true;
          } else {
            // Если пользователь не администратор, перенаправляем на главную страницу
            router.navigateByUrl('/');
            return false;
          }
        })
      );
    })
  );
};
