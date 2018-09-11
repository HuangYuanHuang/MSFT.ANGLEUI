import { Injectable, Inject } from '@angular/core';
import { AppConsts } from '@shared/AppConsts';
import { UserDto, UserAspServiceProxy } from '@shared/service-proxies/service-proxies';
import { UtilsService } from '@abp/utils/utils.service';

@Injectable()
export class SignalrOnlineChatService {

    private static userMap: Map<number, UserDto> = new Map<number, UserDto>();

    private connection;

    constructor(private userAspProxy: UserAspServiceProxy) {


    }
    init(user: UserDto) {
        const encryptedAuthToken = new UtilsService().getCookieValue(AppConsts.authorization.encrptedAuthTokenName);
        abp.signalr = {
            autoConnect: false,
            connect: undefined,
            hubs: undefined,
            qs: AppConsts.authorization.encrptedAuthTokenName + '=' + encodeURIComponent(encryptedAuthToken),
            url: '/signalr',
            remoteServiceBaseUrl: AppConsts.remoteServiceBaseUrl,
            startConnection: undefined
        };
        const courseId = 'Peer-Peer';
        abp.signalr.qs = `groupId=${encodeURIComponent(courseId)}&userId=${user.id}&userName=${encodeURIComponent(user.fullName)}`;
        jQuery.getScript(AppConsts.appBaseUrl + '/assets/abp/abp.signalr-client.js', () => {
            this.initSignalR();
        });
    }
    private initSignalR() {

        abp.signalr.startConnection('/hubs-onlineChatHub', (connection) => {
            this.connection = connection;
            console.log('Connection onlineChatHub is  start');
            this.connection.on('onGetChatMessage', (node) => {
                this.messageFactory(node);
            });
            this.connection.on('onGetUserOnline', (node) => {
                abp.event.trigger('onGetUserOnline', node);
                //     this.subjectOnline.next(node);
            });

        });
    }
    private messageFactory(node: any) {
        const messageNode = new OnlineMessageNode(node.fromUserId, node.toUserId, node.message,
            node.courseId, node.messageType, node.isRead, node.creationTime, node.id);
        switch (node.messageType) {
            case MessageTypeEnum.Text:
            case MessageTypeEnum.System:
                if (AppConsts.isChatView) {
                    abp.event.trigger('onGetChatMessage', messageNode);
                } else {
                    this.userNotify(node.fromUserId, node.message);
                    abp.event.trigger('noticeBadge', 1);
                }
                break;
            case MessageTypeEnum.Follow:
                abp.event.trigger('noticeFollowBadge', 1);
                break;
            case MessageTypeEnum.Audio:
            case MessageTypeEnum.Video:
                console.log(node);
                abp.event.trigger('onMediaInvitation', messageNode);
                break;
            case MessageTypeEnum.Refuse:
            case MessageTypeEnum.Close:
                abp.event.trigger('remoteCallCloseRefuse', messageNode);
                break;
        }

    }

    userNotify(userId: number, message: string) {
        const res = SignalrOnlineChatService.userMap.has(userId);
        if (res) {
            abp.notify.info(message, SignalrOnlineChatService.userMap.get(userId).fullName);
        } else {
            this.userAspProxy.get(userId).subscribe(d => {
                SignalrOnlineChatService.userMap.set(userId, d);
                abp.notify.info(message, d.fullName);
            })
        }
    }
    getUserInfoById(userId: number, callback) {
        const res = SignalrOnlineChatService.userMap.has(userId);
        if (res) {
            callback(SignalrOnlineChatService.userMap.get(userId));
        } else {
            this.userAspProxy.get(userId).subscribe(d => {
                SignalrOnlineChatService.userMap.set(userId, d);
                callback(d);
            })
        }
    }
}
export enum MessageTypeEnum {
    Defalut,
    Text,
    Audio,
    Video,
    Refuse,
    Accept,
    Exit,
    Close,
    System,
    Follow
}
export enum ChatStautsEnum {
    Invitation,
    Confirm,
    Accept,
    Refuse
}
export class OnlineMessageNode {
    constructor(public fromUserId: number, public toUserId: number, public message: string,
        public courseId: string, public messageType: MessageTypeEnum, public isRead: boolean,
        public creationTime: Date, public msgId: number) {
    }
}

export class UserChatModel {
    public badge = 0;
    public online = false;
    public isFollow = true;
    public isSave = false;
    constructor(public isSelect: boolean, public user: UserDto) {

    }
}
