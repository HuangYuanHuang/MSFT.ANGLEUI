import { Component, Injector, ViewChild, OnInit, OnDestroy } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { AppConsts } from '@shared/AppConsts';

import {
  SignalrOnlineChatService, OnlineMessageNode, MessageTypeEnum,
  UserChatModel
} from '@shared/service-proxies/signalr-online-chat-service';
import { UnreadMessageDto, UserDto, UserMessageServiceServiceProxy, UserAspServiceProxy } from '@shared/service-proxies/service-proxies';
import { ChatListComponent } from './chat-list/chat-list.component';
import { ChatPanelComponent } from './chat-panel/chat-panel.component';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { ChatInfoComponent } from './chat-info/chat-info.component';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent extends AppComponentBase implements OnInit, OnDestroy {


  @ViewChild('chatlist') chatListComponent: ChatListComponent;
  @ViewChild('chatpanel') chatPanelComponent: ChatPanelComponent;
  @ViewChild('chatInfo') chatInfoComponent: ChatInfoComponent;


  currentUser: UserDto;
  unredNodes: UnreadMessageDto[];
  public constructor(injector: Injector,
    private userMessageProxy: UserMessageServiceServiceProxy, private route: ActivatedRoute, private router: Router,
    private userProxy: UserAspServiceProxy) {
    super(injector);

  }
  ngOnInit(): void {
    AppConsts.isChatView = true;
    setTimeout(() => {
      abp.event.trigger('noticeBadge', -1);

    }, 3000);
    abp.event.on('onGetChatMessage', (node: OnlineMessageNode) => {
      console.log(node);
      switch (node.messageType) {
        case MessageTypeEnum.Text:
        case MessageTypeEnum.System:
          this.loadMessageChat(node);
          break;

      }
    });
    const userId = this.route.snapshot.params['id'];
    if (userId) {
      this.userProxy.get(userId).subscribe(d => {
        this.ChatClickEvent(d);
      });
    }
  }
  ngOnDestroy(): void {
    AppConsts.isChatView = false;
  }
  loadMessageChat(node: OnlineMessageNode) {
    if (this.currentUser) {
      if (this.currentUser.id === node.fromUserId) {
        this.chatPanelComponent.pushMessage(node);
        this.userMessageProxy.changeMessageRead(node.msgId).subscribe(d => {
          console.log(d);
        });
      } else {
        this.chatListComponent.addBadge(node.fromUserId, 1);
      }
    }
  }

  ChatClickEvent(user: UserDto) {
    console.log(user);
    this.chatListComponent.AddUser(user, true);

    this.currentUser = user;
  }

  currentChatEvent(user: UserChatModel) {
    if (user) {
      this.currentUser = user.user;
      setTimeout(() => {
        this.chatPanelComponent.chat(user);

        this.chatInfoComponent.setUser(user.user);
      }, 100);

    } else {
      abp.message.confirm('You haven\'t added contacts yet, do you want to jump the Follow page? ', (result) => {
        if (result) {
          this.router.navigateByUrl('/profile/followers');
        }
      })
    }

  }

}
