import { Component, ViewChild, Injector, Output, EventEmitter, ElementRef } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { UserServiceProxy, UserDto, RoleDto } from '@shared/service-proxies/service-proxies';
import { AppComponentBase } from '@shared/app-component-base';
import { CountryData } from '@shared/data/country';

import * as _ from 'lodash';
import { finalize } from 'rxjs/operators';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';

@Component({
    selector: 'edit-user-modal',
    templateUrl: './edit-user.component.html'
})
export class EditUserComponent extends AppComponentBase {
    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();
    isVisible = false;
    active = false;
    saving = false;
    validateForm: FormGroup;

    user: UserDto = null;
    roles: RoleDto[] = null;
    countryNodes = [];
    constructor(
        injector: Injector,
        private _userService: UserServiceProxy, private fb: FormBuilder,
    ) {
        super(injector);
        this.countryNodes = CountryData;
        this.validateForm = this.fb.group({
            userName: [null, [Validators.required]],
            firstName: [null, [Validators.required]],
            lastName: [null, [Validators.required]],
            email: [null, [Validators.email]],
            country: [null, [Validators.required]],
            isAcitve: [null]
        });
    }

    userInRole(role: RoleDto, user: UserDto): string {
        if (user.roleNames.indexOf(role.normalizedName) !== -1) {
            return 'checked';
        } else {
            return '';
        }
    }

    show(id: number): void {

        this._userService.getRoles()
            .subscribe((result) => {
                this.roles = result.items;
            });

        this._userService.get(id)
            .subscribe(
                (result) => {
                    this.user = result;
                    this.isVisible = true;
                    this.active = true;
                }
            );
    }
    submitForm(): void {

        this.save();
    }
    save(): void {
        const roles = [];
        $('.div-roles').find('[name=role]').each(function (ind: number, elem: Element) {
            if ($(elem).is(':checked')) {
                roles.push(elem.getAttribute('value').valueOf());
            }
        });

        this.user.roleNames = roles;

        this.saving = true;
        this._userService.update(this.user)
            .pipe(finalize(() => { this.saving = false; }))
            .subscribe(() => {
                this.notify.info(this.l('SavedSuccessfully'));
                this.close();
                this.modalSave.emit(null);
            });
    }
    handleOk(): void {
        this.isVisible = false;
    }

    handleCancel(): void {
        this.isVisible = false;
    }
    close(): void {
        this.active = false;
        this.isVisible = false;
    }
}
