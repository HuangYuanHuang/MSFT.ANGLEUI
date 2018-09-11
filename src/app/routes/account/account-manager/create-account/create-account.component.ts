import { Component, Injector, OnInit, Output, EventEmitter } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import {
  AccountManagerServiceProxy, CreateAccountDto, SchoolServiceProxy, SchoolCascaderDto, SchoolLiscenceDetailDto
} from '@shared/service-proxies/service-proxies';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-create-account',
  templateUrl: './create-account.component.html',
  styleUrls: ['./create-account.component.css']
})
export class CreateAccountComponent extends AppComponentBase implements OnInit {
  @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();

  isVisible = false;
  account: CreateAccountDto;
  validateForm: FormGroup;
  liscenceNodes: SchoolLiscenceDetailDto[];
  saving = false;
  schoolCountry: SchoolCascaderDto[];
  schoolValues = [];
  isSchoolRole = false;
  constructor(
    injector: Injector, private accountService: AccountManagerServiceProxy,
    private fb: FormBuilder, private schoolProxy: SchoolServiceProxy

  ) {
    super(injector);
  }
  ngOnInit() {
    this.validateForm = this.fb.group({
      displayName: [null, [Validators.required]],
      firstName: [null, [Validators.required]],
      lastName: [null, [Validators.required]],
      role: [null],
      liscence: [null],
      email: [null, [Validators.email]],
      schoolCountry: [null, [Validators.required]]
    });
    this.schoolProxy.getCountrySchool().subscribe(d => {
      this.schoolCountry = d;

    });
  }
  submitForm(): void {
    // tslint:disable-next-line:forin
    // for (const i in this.validateForm.controls) {
    //   this.validateForm.controls[i].markAsDirty();
    //   this.validateForm.controls[i].updateValueAndValidity();
    // }
    this.saving = true;

    this.accountService.create(this.account)
      .pipe(finalize(() => { this.saving = false; }))
      .subscribe((d) => {
        this.notify.info(this.l('SavedSuccessfully'));
        abp.message.success(`${this.l('CreateAccountUserId')}:\t${d.userId} \n ${this.l('CreateAccountPassword')}:\t${d.pwd}`,
          'Create Account Success');
        this.isVisible = false;
        this.modalSave.emit(null);
      });
  }

  show(country: string, school: string, admin: boolean): void {
    this.isSchoolRole = admin;
    this.validateForm.reset();

    this.isVisible = true;
    this.account = new CreateAccountDto();
    this.account.firstName = '';
    this.account.lastName = '';
    this.account.displayName = '';
    this.account.liscence = '';
    this.account.role = 'Student';
    this.liscenceNodes = [];
    if (this.isSchoolRole) {
      this.schoolValues = [country, school];
      this.account.country = this.schoolValues[0];
      this.account.schoolId = this.schoolValues[1];
    } else {
      this.schoolValues = [];
    }
    if (!this.isSchoolRole && country !== '') {
      this.schoolCountry.forEach(d => {
        if (d.value !== country) {
          d.disabled = true;
        }
      });
    }



  }
  onChange() {

    if (this.account.firstName || this.account.lastName) {
      this.account.displayName = this.account.firstName + ' ' + this.account.lastName;

    }

    console.log(this.account.firstName, this.account.lastName);
  }
  public onChanges(values: any): void {
    console.log(values);
    if (values && values.length >= 1) {
      this.account.country = values[0];
      this.account.schoolId = values[1];
    }

    if (values && values.length === 0) {
      this.liscenceNodes = [];
    } else {
      this.schoolProxy.getSchoolLiscence(this.account.schoolId).subscribe(d => {
        this.liscenceNodes = d.items;
      });
    }
  }

  handleOk(): void {
    console.log('Button ok clicked!');
    this.isVisible = false;
  }

  handleCancel(): void {
    console.log('Button cancel clicked!');
    this.isVisible = false;
  }
}
