import { Component, Injector, OnInit, Output, EventEmitter } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { SchoolServiceProxy, SchoolDto, PagedResultDtoOfSchoolDto } from '@shared/service-proxies/service-proxies';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CountryData } from '@shared/data/country';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-edit-school',
  templateUrl: './edit-school.component.html',
  styleUrls: ['./edit-school.component.css']
})
export class EditSchoolComponent extends AppComponentBase implements OnInit {
  @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();

  isVisible = false;
  school: SchoolDto;
  validateForm: FormGroup;
  countryNodes = [];
  saving = false;
  constructor(
    injector: Injector, private schoolService: SchoolServiceProxy, private fb: FormBuilder

  ) {
    super(injector);
    this.countryNodes = CountryData;
  }
  ngOnInit() {
    this.validateForm = this.fb.group({
      schoolName: [null, [Validators.required]],
      managerName: [null, [Validators.required]],
      managerEmail: [null, [Validators.email]],
      country: [null]
    });

  }
  submitForm(): void {
    // tslint:disable-next-line:forin
    for (const i in this.validateForm.controls) {
      this.validateForm.controls[i].markAsDirty();
      this.validateForm.controls[i].updateValueAndValidity();
    }
    this.saving = true;
    this.schoolService.update(this.school)
      .pipe(finalize(() => { this.saving = false; }))
      .subscribe(() => {
        this.notify.info(this.l('SavedSuccessfully'));
        this.isVisible = false;
        this.modalSave.emit(null);
      });
  }

  show(item: SchoolDto): void {
    this.school = item;
    this.isVisible = true;
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
