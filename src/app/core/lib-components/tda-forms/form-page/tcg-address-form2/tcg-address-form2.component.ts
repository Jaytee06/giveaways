import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BaseService } from '../../../../../services/base.service';

@Component({
  selector: 'tcg-address-form2',
  templateUrl: './tcg-address-form2.component.html',
  styleUrls: ['./tcg-address-form2.component.scss'],
  providers: [BaseService],
})
export class TcgAddressForm2Component implements OnInit {

  // @Input() model: any;
  @Input() formGroup: FormGroup = new FormGroup({});
  @Input() required: boolean;
  @Output() change = new EventEmitter();

  states = [];

  constructor(
    private fb: FormBuilder,
    private service: BaseService,
  ) {
  }

  ngOnInit() {
    // const validators = [];
    // if (this.required) {
    //   validators.push(Validators.required);
    // }

    // if (!this.model) {
    //   this.model = {};
    //   console.error('No Address Object: Please provide an object to bind to.');
    // }
    // ['address', 'city', 'state', 'zip'].forEach(name => {
    //   const control = this.fb.control(this.model[name], validators);
    //   this.formGroup.addControl(name, control);
    // });

    // this.formGroup.addControl('address2', this.fb.control(this.model['address2']));
    this.states = this.service.getStates();
  }

  onChange() {
    this.change.emit();
  }
}
