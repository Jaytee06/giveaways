import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormArray, FormControl } from '@angular/forms';

@Component({
  selector: 'app-tda-array-input',
  templateUrl: './tda-array-input.component.html',
  styleUrls: ['./tda-array-input.component.scss']
})
export class TdaArrayInputComponent implements OnInit {

  @Input() required;
  @Input() placeholder;
  @Input() formGroup: FormArray;
  @Output() change = new EventEmitter();

  constructor() { }

  ngOnInit() {
    this.formGroup.valueChanges.subscribe((change) => {
      //
      console.log(change);
    });
  }

  delete(index) {
    const formControl = this.formGroup.at(index);
    if (formControl.value._id) {
      formControl.setValue({ ...formControl.value, active: false });
    } else {
      this.formGroup.removeAt(index);
    }
    console.log(this.formGroup.value);
  }

  add() {
    this.formGroup.push(new FormControl({ active: true, name: '' }));
  }

  changeEvent(i, $event) {
    const formControl = this.formGroup.at(i);
    formControl.setValue({ ...formControl.value, name: $event.target.value });
  }
}
