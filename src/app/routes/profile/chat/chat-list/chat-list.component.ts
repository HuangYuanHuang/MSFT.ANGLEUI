import { Component, OnInit, Output, EventEmitter, OnDestroy } from '@angular/core';
import {
  UserDto, FollowerServiceProxy, UserOnlineServiceServiceProxy,
  UserMessageServiceServiceProxy,
  CreateFollowerDto,
  CreateUserMessageDto
} from '@shared/service-proxies/service-proxies';
import { SignalrOnlineChatService, UserChatModel, MessageTypeEnum, } from '@shared/service-proxies/signalr-online-chat-service';
import { NamePipe } from '@shared/pipe/name-pipe';

@Component({
  selector: 'app-chat-list',
  templateUrl: './chat-list.component.html',
  styleUrls: ['./chat-list.component.css'],
  providers: [NamePipe]
})
export class ChatListComponent implements OnInit, OnDestroy {

  @Output() currentChatEvent = new EventEmitter<UserChatModel>();
  users: UserChatModel[] = [];
  selectName;
  constructor(private followProxy: FollowerServiceProxy, private userOnlieProxy: UserOnlineServiceServiceProxy,
    private userMessageProxy: UserMessageServiceServiceProxy, private signalrChatService: SignalrOnlineChatService) {

    abp.event.on('onGetUserOnline', (node) => {
      if (node.userId !== abp.session.userId) {
        const index = this.users.findIndex(d => d.user.id === node.userId);
        if (index >= 0) {
          this.users[index].online = node.isOnline;
        }
      }
    });
  }
  getUserOnline() {
    this.userOnlieProxy.getAllByCourseId('Peer-Peer').subscribe(d => {
      d.items.forEach(g => {
        const index = this.users.findIndex(item => item.user.id === g.userId);
        if (index >= 0) {
          this.users[index].online = g.isOnline;
        }
      })

    })
  }
  ngOnInit() {
    this.followProxy.getAllFollower(abp.session.userId, 0, 10).subscribe(d => {
      d.items.forEach(g => {
        this.users.push(new UserChatModel(false, g));
      });

      if (this.users && this.users.length > 0) {
        this.users = this.users.sort(this.ChatListSortFunction);
        this.chatClick(this.users[0]);
        this.getUserOnline();
        this.loadFinishEvent();
      } else {
        this.currentChatEvent.emit(null);
      }

    });
  }

  ngOnDestroy(): void {
    console.log('ChatList on Destroy');
  }
  loadFinishEvent() {
    this.userMessageProxy.getUnreadMessage(false, abp.session.userId, 'Peer-Peer', 0).subscribe(d => {
      if (d.items.length > 0) {
        d.items.forEach(item => {
          if (item.messageType === MessageTypeEnum.Text) {
            this.addBadge(item.userId, item.count);

          }
        });
      }

    });

  }
  AddUser(user: UserDto, isSelect = true) {
    const index = this.users.findIndex(d => d.user.id === user.id);
    if (index && index < 0) {
      this.users.unshift(new UserChatModel(isSelect, user));
      this.chatClick(this.users[0]);

    } else {
      this.chatClick(this.users[index]);
      this.users = this.users.sort(this.ChatListSortFunction);
    }
  }
  ChatListSortFunction(a: UserChatModel, b: UserChatModel): number {
    let numA = a.isSelect ? 10 : 0;
    let numB = b.isSelect ? 10 : 0;
    numA += a.online ? 2 : 0;
    numB += b.online ? 2 : 0;
    return numB - numA;
  }
  chatClick(data: UserChatModel) {
    this.users.forEach(g => g.isSelect = false);
    data.isSelect = true;
    if (this.currentChatEvent) {
      data.badge = 0;
      this.currentChatEvent.emit(data);
    }
  }
  getCurrentClass(item: UserChatModel): string {
    let defaultClass = '';
    if (item.online) {
      defaultClass = 'online';
    }
    if (item.isSelect) {
      defaultClass += ' active';
    }
    return defaultClass;
  }
  follow(item: UserChatModel) {
    item.isSave = true;
    this.followProxy.userFollers(new CreateFollowerDto({
      userId: abp.session.userId,
      fUserId: item.user.id,
      mark: ''
    })).subscribe(d => {
      this.userMessageProxy.create(new CreateUserMessageDto({
        fromUserId: abp.session.userId,
        toUserId: item.user.id,
        messageType: MessageTypeEnum.Follow,
        id: 0,
        message: 'User Follow',
        courseId: 'Peer-Peer',

      })).subscribe(g => {
        item.isSave = false;
        item.isFollow = true;
        abp.event.trigger('noticeFollowBadge', -1);
      });
    });
  }
  addBadge(userId: number, count = 1) {
    const index = this.users.findIndex(d => d.user.id === userId);
    if (index >= 0) {
      this.users[index].badge += count;
    } else {
      this.signalrChatService.getUserInfoById(userId, (user: UserDto) => {
        const chatModel = new UserChatModel(false, user);
        chatModel.isFollow = false;
        chatModel.badge += count;
        this.users.push(chatModel);
      });
    }
  }
}

