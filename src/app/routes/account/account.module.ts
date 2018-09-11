import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AppRouteGuard } from '@shared/auth/auth-route-guard';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpModule, JsonpModule } from '@angular/http';
import { ReactiveFormsModule } from '@angular/forms';
import { ModalModule } from 'ngx-bootstrap';
import { NgxPaginationModule } from 'ngx-pagination';


import { AbpModule } from '@abp/abp.module';

import { ServiceProxyModule } from '@shared/service-proxies/service-proxy.module';
import { SharedModule } from '@shared/shared.module';

import { UsersComponent } from './users/users.component';
import { CreateUserComponent } from './users/create-user/create-user.component';
import { EditUserComponent } from './users/edit-user/edit-user.component';
import { RolesComponent } from './roles/roles.component';
import { CreateRoleComponent } from './roles/create-role/create-role.component';
import { EditRoleComponent } from './roles/edit-role/edit-role.component';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { SchoolComponent } from './school/school.component';
import { CreateSchoolComponent } from './school/create-school/create-school.component';
import { EditSchoolComponent } from './school/edit-school/edit-school.component';
import { AccountManagerComponent } from './account-manager/account-manager.component';
import { CreateAccountComponent } from './account-manager/create-account/create-account.component';
import { EditAccountComponent } from './account-manager/edit-account/edit-account.component';
import { AspUsersComponent } from './asp-users/asp-users.component';
import { CreateAspUserComponent } from './asp-users/create-asp-user/create-asp-user.component';
import { EditAspUserComponent } from './asp-users/edit-asp-user/edit-asp-user.component';
import { AppMenuService } from '@shared/layout/app-menu.service';
import { TranslateService, TranslateModule, TranslateLoader } from '@ngx-translate/core';

const routes: Routes = [
    { path: 'users', component: UsersComponent, data: { permission: 'Pages.Users' }, canActivate: [AppRouteGuard] },
    { path: 'roles', component: RolesComponent, data: { permission: 'Pages.Roles' }, canActivate: [AppRouteGuard] },
    { path: 'aspusers', component: AspUsersComponent },
    { path: 'school', component: SchoolComponent },
    { path: 'manager', component: AccountManagerComponent },
];
@NgModule({
    declarations: [
        UsersComponent,
        CreateUserComponent,
        EditUserComponent,
        RolesComponent,
        CreateRoleComponent,
        EditRoleComponent,
        SchoolComponent,
        CreateSchoolComponent,
        EditSchoolComponent,
        AccountManagerComponent,
        CreateAccountComponent,
        EditAccountComponent,
        AspUsersComponent,
        CreateAspUserComponent,
        EditAspUserComponent
    ],

    imports: [
        CommonModule,
        TranslateModule,
        FormsModule,
        HttpModule,
        JsonpModule,
        ModalModule.forRoot(),
        RouterModule.forChild(routes),
        AbpModule,
        ServiceProxyModule,
        SharedModule,
        ReactiveFormsModule,
        NgxPaginationModule,
        NgZorroAntdModule.forRoot()
    ],
    providers: [AppMenuService]
})
export class AccountModule { }
