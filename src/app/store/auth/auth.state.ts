import { Action, Selector, State, StateContext } from '@ngxs/store';
import { Injectable } from '@angular/core';
import {
  SetUser,
  SetAccessToken,
  SetRefreshToken,
  Login,
  Logout,
  FetchUser,
  RemoveToken,
  Register,
} from './auth.action';
import { CredentialsInterface, UserInterface } from '@/ts/interfaces';
import { LocalstorageKeys } from '@/ts/enum';
import { AuthService } from '@/services/auth.service';
import { tap } from 'rxjs';

export class AuthStateModel {
  user!: UserInterface | null;
  accessToken!: string | null;
  refreshToken!: string | null;
}

@State<AuthStateModel>({
  name: 'auth',
  defaults: {
    user: null,
    refreshToken: localStorage.getItem(LocalstorageKeys.RefreshToken),
    accessToken: localStorage.getItem(LocalstorageKeys.AccessToken),
  },
})
@Injectable()
export class AuthState {
  constructor(private authService: AuthService) {}

  @Selector()
  static getUser(state: AuthStateModel): UserInterface | null {
    return state.user;
  }

  @Selector()
  static loggedIn(state: AuthStateModel): boolean {
    return !!state.user;
  }

  @Selector()
  static accessToken(state: AuthStateModel): string | null {
    return state.accessToken;
  }

  @Selector()
  static refreshToken(state: AuthStateModel): string | null {
    return state.refreshToken;
  }

  @Action(SetUser)
  setUser(
    { patchState }: StateContext<AuthStateModel>,
    { payload: user }: SetUser
  ): void {
    patchState({
      user,
    });
  }

  @Action(SetAccessToken)
  setAccessToken(
    { patchState }: StateContext<AuthStateModel>,
    { payload: accessToken }: SetAccessToken
  ): void {
    patchState({
      accessToken,
    });

    if (!accessToken) {
      localStorage.removeItem(LocalstorageKeys.AccessToken);
      return;
    }
    localStorage.setItem(LocalstorageKeys.AccessToken, accessToken);
  }

  @Action(SetRefreshToken)
  setRefreshToken(
    { patchState }: StateContext<AuthStateModel>,
    { payload: refreshToken }: SetRefreshToken
  ): void {
    patchState({
      refreshToken,
    });

    if (!refreshToken) {
      localStorage.removeItem(LocalstorageKeys.RefreshToken);
      return;
    }
    localStorage.setItem(LocalstorageKeys.RefreshToken, refreshToken);
  }

  @Action(Login)
  login(ctx: StateContext<AuthStateModel>, action: Login) {
    return this.authService.login(action.payload).pipe(
      tap(({ accessToken, refreshToken, user }: CredentialsInterface) => {
        ctx.patchState({
          accessToken,
          refreshToken,
          user,
        });

        localStorage.setItem(LocalstorageKeys.AccessToken, accessToken);
        localStorage.setItem(LocalstorageKeys.RefreshToken, refreshToken);
      })
    );
  }

  @Action(Register)
  register(ctx: StateContext<AuthStateModel>, action: Register) {
    return this.authService.register(action.payload).pipe(
      tap(({ accessToken, refreshToken, user }: CredentialsInterface) => {
        ctx.patchState({
          accessToken,
          refreshToken,
          user,
        });

        localStorage.setItem(LocalstorageKeys.AccessToken, accessToken);
        localStorage.setItem(LocalstorageKeys.RefreshToken, refreshToken);
      })
    );
  }

  @Action(Logout)
  logout(ctx: StateContext<AuthStateModel>) {
    this.removeTokens(ctx);
    return this.authService.logout();
  }

  private removeTokens(ctx: StateContext<AuthStateModel>) {
    ctx.setState({
      accessToken: null,
      refreshToken: null,
      user: null,
    });

    localStorage.removeItem(LocalstorageKeys.AccessToken);
    localStorage.removeItem(LocalstorageKeys.RefreshToken);
  }

  @Action(FetchUser)
  fetchUser(ctx: StateContext<AuthStateModel>) {
    return this.authService.getUserInfo().pipe(
      tap((user) => {
        ctx.patchState({
          user,
        });

        return user;
      })
    );
  }

  @Action(RemoveToken)
  removeToken(ctx: StateContext<AuthStateModel>) {
    this.removeTokens(ctx);
  }
}
