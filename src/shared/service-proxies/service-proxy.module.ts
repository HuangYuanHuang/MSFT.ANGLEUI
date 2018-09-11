import { NgModule } from '@angular/core';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AbpHttpInterceptor } from '@abp/abpHttpInterceptor';

import * as ApiServiceProxies from './service-proxies';

@NgModule({
    providers: [
        ApiServiceProxies.RoleServiceProxy,
        ApiServiceProxies.SessionServiceProxy,
        ApiServiceProxies.TenantServiceProxy,
        ApiServiceProxies.UserServiceProxy,
        ApiServiceProxies.TokenAuthServiceProxy,
        ApiServiceProxies.AccountServiceProxy,
        ApiServiceProxies.NewInfoServiceProxy,
        ApiServiceProxies.UserAspServiceProxy,
        ApiServiceProxies.FollowerServiceProxy,
        ApiServiceProxies.UserMessageServiceServiceProxy,
        ApiServiceProxies.UserOnlineServiceServiceProxy,
        ApiServiceProxies.ConfigurationServiceProxy,
        ApiServiceProxies.CourseLiveConfigServiceProxy,
        ApiServiceProxies.AuthEdxUserServiceServiceProxy,
        ApiServiceProxies.CourseTagConfigServiceProxy,
        ApiServiceProxies.SchoolServiceProxy,
        ApiServiceProxies.LiscenceServiceProxy,
        ApiServiceProxies.AccountManagerServiceProxy,
        ApiServiceProxies.UserPublicServiceProxy,
        { provide: HTTP_INTERCEPTORS, useClass: AbpHttpInterceptor, multi: true }
    ]
})
export class ServiceProxyModule { }
