import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLinkWithHref, RouterModule, Routes } from '@angular/router';
import { BaseModule } from '@/components/base/base.module';
import { FormInputComponent } from '@/components/base/form-input/form-input.component';
import { ReactiveFormsModule } from '@angular/forms';
import { LoginComponent } from '@/pages/auth/login/login.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { TranslateModule } from '@ngx-translate/core';
import { LoggedInGuard } from '@/app/guards/logged-in.guard';
import { RegisterComponent } from '@/pages/auth/register/register.component';

const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [LoggedInGuard],
  },
  {
    path: 'register',
    component: RegisterComponent,
    canActivate: [LoggedInGuard],
  },
  {
    path: 'forgot-password',
    component: ForgotPasswordComponent,
  },
  {
    path: 'reset-password',
    component: ResetPasswordComponent,
  },
];

@NgModule({
  declarations: [
    LoginComponent,
    ForgotPasswordComponent,
    ResetPasswordComponent,
    RegisterComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    BaseModule,
    FormInputComponent,
    RouterLinkWithHref,
    ReactiveFormsModule,
    TranslateModule,
  ],
})
export class AuthModule {}
