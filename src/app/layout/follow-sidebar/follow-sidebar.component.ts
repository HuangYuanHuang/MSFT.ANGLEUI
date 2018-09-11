import { Component, OnInit } from '@angular/core';
import {
  UserDto, UserMessageServiceServiceProxy, UserMessageDto,
  FollowerServiceProxy, FollowerDto, CreateFollowerDto, CreateUserMessageDto
} from '@shared/service-proxies/service-proxies';
import { OnlineMessageNode, SignalrOnlineChatService, MessageTypeEnum } from '@shared/service-proxies/signalr-online-chat-service';

@Component({
  selector: 'app-follow-sidebar',
  templateUrl: './follow-sidebar.component.html',
  styleUrls: ['./follow-sidebar.component.css']
})
export class FollowSidebarComponent implements OnInit {
  visible = false;
  userFollows: FollowerDto[];
  followNodes: FollowerUserDto[] = [];
  isLoad = false;
  constructor(private userMessageProxy: UserMessageServiceServiceProxy, private signalRService: SignalrOnlineChatService,
    private followerProxy: FollowerServiceProxy) { }

  ngOnInit() {
    abp.event.on('folowsidebarOpen', (args: string) => {
      this.visible = true;

      this.loaduserFollow();


    })
  }
  loaduserFollow() {
    this.isLoad = false;
    this.followNodes = [];
    this.followerProxy.getUserFollows(abp.session.userId).subscribe(g => {
      this.userFollows = g.items;
      this.userMessageProxy.getFollows(abp.session.userId).subscribe(d => {
        this.isLoad = true;
        d.items.forEach(item => {
          if (item.messageType === MessageTypeEnum.Follow) {

          }
          this.signalRService.getUserInfoById(item.fromUserId, (user: UserDto) => {
            const isFollow = this.userFollows.findIndex(u => u.fUserId === user.id);
            this.followNodes.push(new FollowerUserDto(user, item.creationTime, isFollow !== -1));
          });
        });
        if (d.items.length > 0) {
          this.changeMessage(d.items[0].id);
        }
      });
    });

  }
  changeMessage(msgId: number) {
    this.userMessageProxy.changeFollowMessageRead(msgId).subscribe(g => {
      abp.event.trigger('noticeFollowBadge', 0);
    });
  }
  follow(item: FollowerUserDto) {
    item.isSave = true;
    this.followerProxy.userFollers(new CreateFollowerDto({
      userId: abp.session.userId,
      fUserId: item.user.id,
      mark: ''
    })).subscribe(d => {
      item.isFollow = !item.isFollow;
      if (item.isFollow) {
        this.userMessageProxy.create(new CreateUserMessageDto({
          fromUserId: abp.session.userId,
          toUserId: item.user.id,
          messageType: MessageTypeEnum.Follow,
          id: 0,
          message: 'User Follow',
          courseId: 'Peer-Peer',

        })).subscribe(g => {
          item.isSave = false;
          const follower = new FollowerDto();
          follower.userId = abp.session.userId;
          follower.fUserId = item.user.id;
          this.userFollows.push(follower);
        });

      }
    });
  }

  open(): void {
    this.visible = true;
  }

  close(): void {
    this.visible = false;
  }
}
class FollowerUserDto {

  public isSave = false;

  constructor(public user: UserDto, public createTime: any, public isFollow: boolean) {

  }
}
