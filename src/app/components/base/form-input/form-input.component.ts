import { Component, Input, Optional, Self } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ControlValueAccessor,
  NgControl,
  ReactiveFormsModule,
} from '@angular/forms';

@Component({
  selector: 'FormInput',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './form-input.component.html',
})
export class FormInputComponent implements ControlValueAccessor {
  @Input() icon: string | undefined = undefined;
  @Input() type: string = 'text';
  @Input() disabled: boolean = false;
  @Input() label: string = '';

  constructor(@Self() @Optional() private control: NgControl) {
    this.control.valueAccessor = this;
  }

  get areMessageShown(): boolean {
    return !!this.control.touched || !!this.control.dirty;
  }

  get errors(): any {
    return this.control.errors;
  }

  get errorMessage(): string {
    const messages = [];

    if (!this.errors) {
      return '';
    }

    if (this.errors.hasOwnProperty('required')) {
      messages.push('This is required field');
    }

    if (this.errors.hasOwnProperty('email')) {
      messages.push('Invalid email format');
    }

    if (this.errors.hasOwnProperty('minlength')) {
      messages.push(
        `Minimal length is ${this.errors.minlength.requiredLength} (${this.errors.minlength.actualLength})`
      );
    }

    if (this.errors.hasOwnProperty('maxlength')) {
      messages.push(
        `Minimal length is ${this.errors.maxlength.requiredLength} (${this.errors.maxlength.actualLength})`
      );
    }

    return messages.join(', ');
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onChange = (value: any) => {};

  onTouched = () => {};
  writeValue(value: any): void {
    this.onChange(value);
  }

  registerOnChange(fn: (rating: number) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }
}
