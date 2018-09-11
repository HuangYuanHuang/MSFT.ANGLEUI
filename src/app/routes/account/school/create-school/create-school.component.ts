import { Component, Injector, OnInit, Output, EventEmitter } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import {
  SchoolServiceProxy, UserServiceProxy, CreateSchoolDto, LiscenceServiceProxy,
  PagedResultDtoOfLiscenceDto, CreateSchoolLiscenceDto, SchoolDto
} from '@shared/service-proxies/service-proxies';
import { AbstractControl, FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { CountryData } from '@shared/data/country';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-create-school',
  templateUrl: './create-school.component.html',
  styleUrls: ['./create-school.component.css']
})
export class CreateSchoolComponent extends AppComponentBase implements OnInit {
  @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();

  isVisible = false;
  school: CreateSchoolDto;
  validateForm: FormGroup;
  countryNodes = [];
  saving = false;
  liscenceNodes: LiscenceViewNode[];
  isAdmin = false;
  constructor(
    injector: Injector, private schoolService: SchoolServiceProxy, private _userService: UserServiceProxy,
    private fb: FormBuilder, private liscenceService: LiscenceServiceProxy

  ) {
    super(injector);
    this.countryNodes = CountryData;
  }
  ngOnInit() {
    this.validateForm = this.fb.group({
      schoolName: [null, [Validators.required]],
      managerName: [null, [Validators.required]],
      managerEmail: [null, [Validators.email]],
      country: [null, [Validators.required]]
    });
    this.liscenceService.getAll(0, 100).subscribe((d: PagedResultDtoOfLiscenceDto) => {
      this.liscenceNodes = [];
      d.items.forEach(f => {
        this.liscenceNodes.push(new LiscenceViewNode(f.type, f.id, 99999));
        this.validateForm.addControl('switch-' + f.type, new FormControl(null, Validators.required));
      });
    });
  }
  submitForm(): void {
    // tslint:disable-next-line:forin
    for (const i in this.validateForm.controls) {
      this.validateForm.controls[i].markAsDirty();
      this.validateForm.controls[i].updateValueAndValidity();
    }
    this.saving = true;
    this.school.liscences = [];
    this.liscenceNodes.filter(d => d.isChecked).forEach(d => {
      const temp = new CreateSchoolLiscenceDto({ schoolId: '', liscenceId: d.lisenceId, maxCount: d.maxCount });
      this.school.liscences.push(temp);
    });
    this.schoolService.create(this.school)
      .pipe(finalize(() => { this.saving = false; }))
      .subscribe((res: SchoolDto) => {
        abp.message.success(`${this.l('CreateSchoolUserId')}:\t${res.schoolAccount} \n ${this.l('CreateSchoolPassword')}:\t${res.pwd}`,
          'Create School Success');

        this.notify.info(this.l('SavedSuccessfully'));
        this.isVisible = false;
        this.modalSave.emit(null);
      });
  }

  show(country: string): void {
    this.isVisible = true;
    this.school = new CreateSchoolDto();
    this.school.country = country;
    if (country === '') {
      this.isAdmin = true;
    }
    this.school.roleNames = ['School Coordinator'];
    this.validateForm.reset();

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

class LiscenceViewNode {
  public isChecked = false;
  constructor(public name: string, public lisenceId: string, public maxCount: number) {

  }
  ngModelChange() {
    console.log(this.isChecked);
  }
}
