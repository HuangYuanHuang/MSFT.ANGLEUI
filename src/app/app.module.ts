import { AbpModule } from '@abp/abp.module';

import { ServiceProxyModule } from '@shared/service-proxies/service-proxy.module';
import { SharedModule } from '@shared/shared.module';


import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'; // this is needed!
import { NgModule, Injector, APP_INITIALIZER, LOCALE_ID } from '@angular/core';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { TranslateService, TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import { AppComponent } from './app.component';

import { CoreModule } from './core/core.module';
import { LayoutModule } from './layout/layout.module';
import { AngleSharedModule } from '@angle/shared.module';
import { RoutesModule } from './routes/routes.module';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { PlatformLocation } from '@angular/common';

import { AbpHttpInterceptor } from '@abp/abpHttpInterceptor';
import { HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppConsts } from '@shared/AppConsts';
import { AppSessionService } from '@shared/session/app-session.service';
import { API_BASE_URL } from '@shared/service-proxies/service-proxies';
import { SignalrOnlineChatService } from '@shared/service-proxies/signalr-online-chat-service';
import { AgoraService } from '@shared/service-proxies/agora-service';

import { AppPreBootstrap } from '../AppPreBootstrap';
import { ModalModule } from 'ngx-bootstrap';


export function appInitializerFactory(injector: Injector,
    platformLocation: PlatformLocation) {
    return () => {

       // abp.ui.setBusy();
        return new Promise<boolean>((resolve, reject) => {
            AppConsts.appBaseHref = getBaseHref(platformLocation);
            const appBaseUrl = getDocumentOrigin() + AppConsts.appBaseHref;

            AppPreBootstrap.run(appBaseUrl, () => {
                abp.event.trigger('abp.dynamicScriptsInitialized');
                const appSessionService: AppSessionService = injector.get(AppSessionService);
                appSessionService.init().then(
                    (result) => {
                     //   abp.ui.clearBusy();
                        resolve(result);
                    },
                    (err) => {
                      //  abp.ui.clearBusy();
                        reject(err);
                    }
                );
            });
        });
    }
}

export function getRemoteServiceBaseUrl(): string {
    return AppConsts.remoteServiceBaseUrl;
}

export function getCurrentLanguage(): string {
    return abp.localization.currentLanguage.name;
}
// https://github.com/ocombe/ng2-translate/issues/218
export function createTranslateLoader(http: HttpClient) {
    return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
    declarations: [
        AppComponent,
    ],
    imports: [
        BrowserModule,
        SharedModule.forRoot(),
        ModalModule.forRoot(),
        AbpModule,
        ServiceProxyModule,
        HttpClientModule,
        BrowserAnimationsModule, // required for ng2-tag-input
        CoreModule,
        LayoutModule, NgZorroAntdModule.forRoot(),
        AngleSharedModule.forRoot(),
        RoutesModule,
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: (createTranslateLoader),
                deps: [HttpClient]
            }
        })
    ],
    providers: [SignalrOnlineChatService, AgoraService,
        { provide: HTTP_INTERCEPTORS, useClass: AbpHttpInterceptor, multi: true },
        { provide: API_BASE_URL, useFactory: getRemoteServiceBaseUrl },
        {
            provide: APP_INITIALIZER,
            useFactory: appInitializerFactory,
            deps: [Injector, PlatformLocation],
            multi: true
        },
        {
            provide: LOCALE_ID,
            useFactory: getCurrentLanguage
        }],
    bootstrap: [AppComponent]
})
export class AppModule { }
export function getBaseHref(platformLocation: PlatformLocation): string {
    const baseUrl = platformLocation.getBaseHrefFromDOM();
    if (baseUrl) {
        return baseUrl;
    }

    return '/';
}

function getDocumentOrigin() {
    if (!document.location.origin) {
        return document.location.protocol + '//' + document.location.hostname +
            (document.location.port ? ':' + document.location.port : '');
    }

    return document.location.origin;
}
