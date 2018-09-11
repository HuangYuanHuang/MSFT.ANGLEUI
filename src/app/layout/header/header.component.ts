import { Component, OnInit, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { NzModalService, NzModalRef } from 'ng-zorro-antd';
const screenfull = require('screenfull');
const browser = require('jquery.browser');

declare var $: any;
import { AppAuthService } from '@shared/auth/app-auth.service';

import { UserblockService } from '../sidebar/userblock/userblock.service';
import { SettingsService } from '../../core/settings/settings.service';
import { MenuService } from '../../core/menu/menu.service';
import { Router } from '@angular/router';
import { OnlineMessageNode, SignalrOnlineChatService, MessageTypeEnum } from '@shared/service-proxies/signalr-online-chat-service';
import { UserDto, UserMessageServiceServiceProxy } from '@shared/service-proxies/service-proxies';
@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

    navCollapsed = true; // for horizontal layout
    menuItems = []; // for horizontal layout
    newBadge = 0;
    newFollowBadge = 0;
    isNavSearchVisible: boolean;
    tplModal: NzModalRef;
    mediaChat = false;
    @ViewChild('fsbutton') fsbutton;  // the fullscreen button

    constructor(public menu: MenuService, private router: Router, private trans: TranslateService,
        private chatService: SignalrOnlineChatService, private modalService: NzModalService,
        private userMessageProxy: UserMessageServiceServiceProxy,
        public userblockService: UserblockService, public settings: SettingsService, private authService: AppAuthService) {

        // show only a few items on demo
        this.menuItems = menu.getMenu().slice(0, 4); // for horizontal layout
        abp.event.on('noticeBadge', (num) => {
            if (num > 0) {
                this.newBadge++;
            } else {
                this.newBadge = 0;
            }
        });
        abp.event.on('noticeFollowBadge', (num) => {
            if (num === 0) {
                this.newFollowBadge = 0;
            } else {
                this.newFollowBadge += num;

            }
        });
        this.userMessageProxy.getUnreadMessage(false, abp.session.userId, 'Peer-Peer', 0).subscribe(d => {
            if (d.items.length > 0) {
                d.items.forEach(g => {
                    if (g.messageType === MessageTypeEnum.Text) {
                        this.newBadge += g.count;
                    } else if (g.messageType === MessageTypeEnum.Follow) {
                        this.newFollowBadge += g.count;
                    }
                });
            }

        });
    }
    chatView() {
        this.router.navigate(['/profile/chat'])
    }
    followView() {
        abp.event.trigger('folowsidebarOpen', 'open');
    };
    ngOnInit() {
        this.isNavSearchVisible = false;
        if (browser.msie) { // Not supported under IE
            this.fsbutton.nativeElement.style.display = 'none';
        }
        abp.event.on('mediaChatClose', (args: string) => {
            this.mediaChat = false;
        });
        abp.event.on('mediaChatOver', (args: string) => {
            this.mediaChat = false;
        });
        abp.event.on('mediaChatBegin', (args: string) => {
            this.mediaChat = true;
        });
        abp.event.on('onMediaInvitation', (node: OnlineMessageNode) => {
            this.chatService.getUserInfoById(node.fromUserId, (d: UserDto) => {
                abp.event.trigger('callInvitation', node);
                const title = this.trans.instant('Chat.Callrequestfrom', { userName: d.fullName });
                this.tplModal = this.modalService.confirm({
                    nzTitle: this.trans.instant('Chat.CallInvitation'),
                    nzContent: title,
                    nzOkText: this.trans.instant('Chat.Accpet'),
                    nzOkType: 'primary',
                    nzOnOk: () => abp.event.trigger('callAccept', node),
                    nzCancelText: this.trans.instant('Chat.Refuse'),
                    nzOnCancel: () => abp.event.trigger('callRefuse', node)
                });
            })

        });
        abp.event.on('userCancel', (ndoe: OnlineMessageNode) => {
            if (this.tplModal) {
                this.tplModal.close();
            }
        })
    }
    toggleMedia() {
        abp.event.trigger('mediaPanel', 'toggle');
    }
    toggleUserBlock(event) {
        event.preventDefault();
        this.userblockService.toggleVisibility();
    }
    Logout() {
        this.authService.logout();
    }
    openNavSearch(event) {
        event.preventDefault();
        event.stopPropagation();
        this.setNavSearchVisible(true);
    }

    setNavSearchVisible(stat: boolean) {
        // console.log(stat);
        this.isNavSearchVisible = stat;
    }

    getNavSearchVisible() {
        return this.isNavSearchVisible;
    }

    toggleOffsidebar() {
        abp.event.trigger('offsidebarOpen', 'offsidebarOpen');
        // this.settings.toggleLayoutSetting('offsidebarOpen');
    }

    toggleCollapsedSideabar() {
        this.settings.toggleLayoutSetting('isCollapsed');
    }

    isCollapsedText() {
        return this.settings.getLayoutSetting('isCollapsedText');
    }

    toggleFullScreen(event) {

        if (screenfull.enabled) {
            screenfull.toggle();
        }
        // Switch icon indicator
        const el = $(this.fsbutton.nativeElement);
        if (screenfull.isFullscreen) {
            el.children('em').removeClass('fa-expand').addClass('fa-compress');
        } else {
            el.children('em').removeClass('fa-compress').addClass('fa-expand');
        }
    }
}
