import { Component, Injector, OnInit, Output, EventEmitter } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import {
  AccountManagerServiceProxy, SchoolCascaderDto, AccountDto, UpdateAccountDto, SchoolServiceProxy, SchoolLiscenceDetailDto
} from '@shared/service-proxies/service-proxies';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-edit-account',
  templateUrl: './edit-account.component.html',
  styleUrls: ['./edit-account.component.css']
})
export class EditAccountComponent extends AppComponentBase implements OnInit {

  @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();

  isVisible = false;
  account: UpdateAccountDto;
  validateForm: FormGroup;
  liscenceNodes: SchoolLiscenceDetailDto[];
  saving = false;
  schoolCountry: SchoolCascaderDto[];
  schoolValues = [];
  constructor(
    injector: Injector, private accountService: AccountManagerServiceProxy,
    private fb: FormBuilder, private schoolProxy: SchoolServiceProxy

  ) {
    super(injector);
  }
  ngOnInit() {
    this.validateForm = this.fb.group({
      displayName: [null, [Validators.required]],
      email: [null, [Validators.email]],
      liscence: [null]
    });

  }
  submitForm(): void {
    // tslint:disable-next-line:forin
    for (const i in this.validateForm.controls) {
      this.validateForm.controls[i].markAsDirty();
      this.validateForm.controls[i].updateValueAndValidity();
    }
    this.saving = true;

    this.accountService.update(this.account)
      .pipe(finalize(() => { this.saving = false; }))
      .subscribe((d) => {
        this.notify.info(this.l('SavedSuccessfully'));
        this.isVisible = false;
        this.modalSave.emit(null);
      });
  }

  show(item: AccountDto): void {
    this.account = new UpdateAccountDto();
    this.account.displayName = item.displayName;
    this.account.id = item.id;
    this.account.email = item.email;
    this.schoolProxy.getSchoolLiscence(item.schoolId).subscribe(d => {
      this.liscenceNodes = d.items;
      this.account.liscence = item.liscence;
      this.isVisible = true;
    });
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
