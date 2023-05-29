import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  CredentialsInterface,
  LoginInterface,
  RegisterInterface,
  TokensInterface,
  UserInterface,
} from '@/ts/interfaces';
import { Observable } from 'rxjs';
import { ApiRoutes } from '@/ts/enum';
import { Store } from '@ngxs/store';
import { AUTHORIZATION_HEADER_PREFIX } from '@/ts/consts';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient, private store: Store) {}

  login(payload: LoginInterface): Observable<CredentialsInterface> {
    return this.http.post<CredentialsInterface>(ApiRoutes.Login, payload);
  }

  register(payload: RegisterInterface): Observable<CredentialsInterface> {
    return this.http.post<CredentialsInterface>(ApiRoutes.Register, {
      ...payload,
      roles: ['user'],
    });
  }

  logout(): Observable<void> {
    return this.http.post<void>(ApiRoutes.Logout, {});
  }

  refresh(): Observable<any> {
    const token = this.store.selectSnapshot<string>(
      (state) => state.auth.refreshToken
    );
    return this.http.get<TokensInterface>(ApiRoutes.Refresh, {
      headers: {
        Authorization: `${AUTHORIZATION_HEADER_PREFIX} ${token}`,
      },
    });
  }

  getUserInfo(): Observable<UserInterface> {
    return this.http.get<UserInterface>(ApiRoutes.UserInfo);
  }
}
