import { UserDto } from '@shared/service-proxies/service-proxies';

export class AppConsts {

    static remoteServiceBaseUrl: string;
    static appBaseUrl: string;
    static appBaseHref: string; // returns angular's base-href parameter value if used during the publish

    static currentUser: UserDto;
    static isChatView = false;
    static AgoraId = 'e9d472624b594643a423235a0376e3a8';
    static readonly userManagement = {
        defaultAdminUserName: 'admin'
    };

    static readonly localization = {
        defaultLocalizationSourceName: 'HsjcEdu'
    };

    static readonly authorization = {
        encrptedAuthTokenName: 'enc_auth_token'
    };
}
