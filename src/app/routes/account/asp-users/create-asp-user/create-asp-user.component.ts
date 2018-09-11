import { Component, OnInit, Output, EventEmitter, Injector } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { UserAspServiceProxy, CreateUserDto } from '@shared/service-proxies/service-proxies';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { CountryData } from '@shared/data/country';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-create-asp-user',
  templateUrl: './create-asp-user.component.html',
  styleUrls: ['./create-asp-user.component.css']
})

export class CreateAspUserComponent extends AppComponentBase implements OnInit {
  @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();


  isVisible = false;
  account: CreateUserDto;
  validateForm: FormGroup;
  countryNodes = [];
  saving = false;
  schoolValues = [];
  currentRole: any;
  staticRoleMap = new Map<string, any>();
  constructor(injector: Injector, private _userService: UserAspServiceProxy, private fb: FormBuilder) {
    super(injector);
    this.countryNodes = CountryData;
    this.staticRoleMap.set('ASPnet CMC', { radioAspnet: true, radioCountry: true, radioSchool: true, countrySelect: true });
    this.staticRoleMap.set('Country Coordinator', { radioAspnet: false, radioCountry: true, radioSchool: true, countrySelect: false });

    this.staticRoleMap.set('School Coordinator', { radioAspnet: false, radioCountry: false, radioSchool: true, countrySelect: false });

  }
  ngOnInit() {
    this.validateForm = this.fb.group({
      displayName: [null, [Validators.required]],
      firstName: [null, [Validators.required]],
      lastName: [null, [Validators.required]],
      email: [null, [Validators.email]],
      country: [null, [Validators.required]],
      schoolName: [null],
      mark: [null]
    });

  }
  submitForm(): void {

    this.saving = true;
    this.account.roleNames = [this.account.mark];
    this._userService.create(this.account)
      .pipe(finalize(() => { this.saving = false; }))
      .subscribe((d) => {
        this.notify.info(this.l('SavedSuccessfully'));
        abp.message.success(`${this.l('CreateASPAccountUserId')}:\t${d.userName} \n ${this.l('CreateASPAccountPassword')}:\t${d.pwd}`,
          'Create ASPAccount Success');
        this.isVisible = false;
        this.modalSave.emit(null);
      });
  }
  onChange() {

    if (this.account.name || this.account.surname) {
      this.account.userName = this.account.name + ' ' + this.account.surname;

    }
  }
  show(role: string, country: string): void {
    // this.validateForm.reset();

    this.isVisible = true;
    this.account = new CreateUserDto();
    this.account.password = 'reanda24no';
    this.account.isActive = true;
    this.account.name = '';
    this.account.mark = role;
    this.account.roleNames = [role];
    this.account.country = country;
    this.currentRole = this.staticRoleMap.get(role);
  }

  handleOk(): void {
    this.isVisible = false;
  }

  handleCancel(): void {
    this.isVisible = false;
  }
}
