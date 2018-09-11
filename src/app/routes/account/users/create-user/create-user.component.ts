import { Component, ViewChild, Injector, Output, EventEmitter, ElementRef, OnInit } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { UserServiceProxy, CreateUserDto, RoleDto } from '@shared/service-proxies/service-proxies';
import { AppComponentBase } from '@shared/app-component-base';
import { CountryData } from '@shared/data/country';
import { finalize } from 'rxjs/operators';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';

@Component({
    selector: 'create-user-modal',
    templateUrl: './create-user.component.html'
})
export class CreateUserComponent extends AppComponentBase implements OnInit {

    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();
    isVisible = false;
    active = false;
    saving = false;
    user: CreateUserDto = null;
    roles: RoleDto[] = null;
    validateForm: FormGroup;

    countryNodes = [];
    constructor(
        injector: Injector,
        private _userService: UserServiceProxy, private fb: FormBuilder,
    ) {
        super(injector);
        this.countryNodes = CountryData
    }

    ngOnInit(): void {
        this.validateForm = this.fb.group({
            userName: [null, [Validators.required]],
            firstName: [null, [Validators.required]],
            lastName: [null, [Validators.required]],
            email: [null, [Validators.email]],
            country: [null, [Validators.required]],
            password: [null, [Validators.required]],
            checkPassword: [null, [Validators.required, this.confirmationValidator]],
            isAcitve: [null]
        });
        this._userService.getRoles()
            .subscribe((result) => {
                this.roles = result.items;
            });
        $('.cdk-overlay-pane').css('z-index', 1100);
    }
    updateConfirmValidator(): void {
        Promise.resolve().then(() => this.validateForm.controls.checkPassword.updateValueAndValidity());
    }
    confirmationValidator = (control: FormControl): { [s: string]: boolean } => {
        if (!control.value) {
            return { required: true };
        } else if (control.value !== this.validateForm.controls.password.value) {
            return { confirm: true, error: true };
        }
    }
    show(): void {
        this.active = true;
        this.isVisible = true;
        this.user = new CreateUserDto();
        this.user.init({ isActive: true });
        this.validateForm.reset();
    }
    submitForm(): void {

        this.save();
    }

    save(): void {
        // TODO: Refactor this, don't use jQuery style code
        const roles = [];
        $('.div-roles').find('[name=role]').each((ind: number, elem: Element) => {
            if ($(elem).is(':checked') === true) {
                roles.push(elem.getAttribute('value').valueOf());
            }
        });

        this.user.roleNames = roles;
        this.saving = true;
        console.log(this.user);

        this._userService.create(this.user)
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
