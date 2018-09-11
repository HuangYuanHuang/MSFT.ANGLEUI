
import { Component, OnInit, Output, EventEmitter, Injector } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { UserAspServiceProxy, UserDto } from '@shared/service-proxies/service-proxies';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-edit-asp-user',
  templateUrl: './edit-asp-user.component.html',
  styleUrls: ['./edit-asp-user.component.css']
})

export class EditAspUserComponent extends AppComponentBase implements OnInit {
  @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();


  isVisible = false;
  account: UserDto;
  validateForm: FormGroup;
  saving = false;
  constructor(injector: Injector, private _userService: UserAspServiceProxy, private fb: FormBuilder) {
    super(injector);
  }
  ngOnInit() {
    this.validateForm = this.fb.group({
      displayName: [null, [Validators.required]],
      firstName: [null, [Validators.required]],
      lastName: [null, [Validators.required]],
      email: [null, [Validators.email]],
      isAcitve: [null],
      schoolName: [null]


    });

  }
  submitForm(): void {
    this.saving = true;
    this._userService.update(this.account)
      .pipe(finalize(() => { this.saving = false; }))
      .subscribe((d) => {
        this.notify.info(this.l('SavedSuccessfully'));
        this.isVisible = false;
        this.modalSave.emit(null);
      });
  }
  onChange() {

    if (this.account.name || this.account.surname) {
      this.account.fullName = this.account.surname + ' ' + this.account.name;
    }
  }
  show(user: UserDto): void {
    //  this.validateForm.reset();
    this.isVisible = true;
    this.account = new UserDto();
    this.account.id = user.id;
    this.account.mark = user.mark;
    this.account.emailAddress = user.emailAddress;
    this.account.name = user.name;
    this.account.userName = user.userName;
    this.account.surname = user.surname;
    this.account.fullName = user.fullName;
    this.account.isActive = user.isActive;
    this.account.schoolName = user.schoolName;
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
