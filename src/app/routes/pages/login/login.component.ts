import { Component, OnInit, Injector } from '@angular/core';
import { SettingsService } from '../../../core/settings/settings.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CustomValidators } from 'ng2-validation';
import { Router } from '@angular/router';
import { AppComponentBase } from '@shared/app-component-base';
import { LoginService } from './login.service';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AbpSessionService } from '@abp/session/abp-session.service';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
    animations: [appModuleAnimation()]
})
export class LoginComponent extends AppComponentBase implements OnInit {

    valForm: FormGroup;
    submitting = true;
    constructor(public settings: SettingsService, fb: FormBuilder, injector: Injector,
        public loginService: LoginService,
        private _router: Router,
        private _sessionService: AbpSessionService) {
        super(injector);
        this.valForm = fb.group({
            'email': [null, Validators.compose([Validators.required])],
            'password': [null, Validators.required],
            'rememberMe': [null]
        });

    }

    submitForm($ev, value: any) {
        $ev.preventDefault();
        // tslint:disable-next-line:forin
        for (const c in this.valForm.controls) {
            this.valForm.controls[c].markAsTouched();
        }
        if (this.valForm.valid) {
            this.loginService.authenticate(
                () => this.submitting = false
            );
        }
    }

    ngOnInit() {
        $('body').css({
            'background': 'url(/assets/img/login-bg.png)',
            'background-repeat': 'no-repeat;',
            'background-size': 'cover',
            'background-position': 'top'
        });
    }

}
