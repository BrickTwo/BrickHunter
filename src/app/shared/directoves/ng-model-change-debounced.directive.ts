import { Directive, EventEmitter, Input, OnDestroy, Output } from '@angular/core';
import { NgModel } from '@angular/forms';
import { Subscription, debounceTime, distinctUntilChanged, skip } from 'rxjs';

@Directive({
  selector: '[ngModelChangeDebounced]',
})
export class NgModelChangeDebouncedDirective implements OnDestroy {
  @Output()
  ngModelChangeDebounced = new EventEmitter<any>();
  @Input()
  ngModelChangeDebounceTime = 500; // optional, 500 default

  subscription: Subscription;
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  constructor(private ngModel: NgModel) {
    this.subscription = this.ngModel.control.valueChanges
      .pipe(
        skip(1), // skip initial value
        distinctUntilChanged(),
        debounceTime(this.ngModelChangeDebounceTime)
      )
      .subscribe(value => this.ngModelChangeDebounced.emit(value));
  }
}
