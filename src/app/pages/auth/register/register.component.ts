import { Component } from '@angular/core';
import { AlertTypes, PageRoutes } from '@/ts/enum';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { RegisterInterface } from '@/ts/interfaces';
import { Store } from '@ngxs/store';
import { Register } from '@/app/store/auth/auth.action';
import { ShowAlert } from '@/app/store/alert/alert.action';

@Component({
  selector: 'app-login',
  templateUrl: './register.component.html',
})
export class RegisterComponent {
  registerForm = new FormGroup({
    email: new FormControl('test@domain.com', [
      Validators.required,
      Validators.email,
    ]),
    firstName: new FormControl('1s2ASD3d4@5678', [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(128),
    ]),
    password: new FormControl('1s2ASD3d4@5678', [
      Validators.required,
      Validators.minLength(8),
      Validators.maxLength(256),
    ]),
    lastName: new FormControl('1s2ASD3d4@5678', [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(128),
    ]),
  });

  constructor(private store: Store) {}

  get loginUrl(): string {
    return PageRoutes.Login;
  }

  async submit(): Promise<void> {
    this.store
      .dispatch(new Register(<RegisterInterface>this.registerForm.value))
      .subscribe({
        next: () => {
          window.location.href = '/';
        },
        error: (err: any) => {
          this.store.dispatch(
            new ShowAlert({
              type: AlertTypes.Error,
              title: 'Error',
              message: err?.message,
            })
          );
        },
      });
  }
}
