import { Component, forwardRef, Input, OnInit } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-input-text',
  templateUrl: './input-text.component.html',
  styleUrls: ['./input-text.component.scss'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => InputTextComponent),
    multi: true
  }]
})

export class InputTextComponent implements OnInit, ControlValueAccessor {


  @Input() showInput: boolean = true;
  @Input() showInputTextPlaceholder: boolean = true;
  @Input() showInputLabel: boolean = true;

  @Input() forInputLabel: string = '';
  @Input() labelName: string = '';

  @Input() inputType: string[] = ['text', 'number', 'password', 'date', 'select'];
  @Input() inputTextPlaceholder: string = '';
  @Input() nameInput: string = '';
  @Input() idInput: string = '';

  value: string = '';
  onChange: any = () => {};
  onTouched: any = () => {};

  onInput(event: Event) {
    const value = (event.target as HTMLInputElement).value
    this.onChange(value)
  }


  constructor() { }
  writeValue(value: any): void {
    this.value = value;
  }
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }
  setDisabledState?(isDisabled: boolean): void {
    throw new Error('Method not implemented.');
  }

  ngOnInit(): void {
  }

}
