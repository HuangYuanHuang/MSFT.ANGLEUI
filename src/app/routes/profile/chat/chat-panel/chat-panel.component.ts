import { Component, OnInit } from '@angular/core';
import { AppConsts } from '@shared/AppConsts';
import {
  UserDto, UserAspServiceProxy,
  UserMessageServiceServiceProxy, UserMessageDto, CreateUserMessageDto
} from '@shared/service-proxies/service-proxies';
import { MessageTypeEnum, OnlineMessageNode, UserChatModel } from '@shared/service-proxies/signalr-online-chat-service';
import * as moment from 'moment';
@Component({
  selector: 'app-chat-panel',
  templateUrl: './chat-panel.component.html',
  styleUrls: ['./chat-panel.component.css']
})
export class ChatPanelComponent implements OnInit {
  messageNodes: UserMessageDto[] = [];
  currentUser: UserDto = new UserDto();
  chatModel: UserChatModel;
  messageText: string;
  selfUser: UserDto;
  isMediaChat = false;
  constructor(private messageProxy: UserMessageServiceServiceProxy, private userAspProxy: UserAspServiceProxy) {
    this.selfUser = AppConsts.currentUser;
  }

  ngOnInit() {
    abp.event.on('mediaChatOver', (args: string) => {
      this.isMediaChat = false;
    });
    abp.event.on('mediaChatLog', (node: UserMessageDto) => {
      this.messageNodes.push(node);
      setTimeout(() => {
        $('#m-message').scrollTop(50000);
      }, 100);
    });
  }
  sendMessage() {
    const createDto = new CreateUserMessageDto({
      fromUserId: abp.session.userId,
      toUserId: this.currentUser.id,
      message: this.messageText.toString().trim(),
      courseId: 'Peer-Peer',
      messageType: MessageTypeEnum.Text,
      id: 0
    });
    this.messageText = '';
    this.messageProxy.create(createDto).subscribe(d => {
      this.messageNodes.push(d);
      setTimeout(() => {
        $('#m-message').scrollTop(50000);
      }, 100);
    });
  }
  chat(user: UserChatModel) {
    this.chatModel = user;
    this.currentUser = user.user;
    this.messageProxy.getMessages(false, user.user.id, 'Peer-Peer', abp.session.userId).subscribe(d => {
      this.messageNodes = d.items;
      setTimeout(() => {
        $('#m-message').scrollTop(50000);
      }, 100);
      if (this.messageNodes.length > 0) {
        this.messageProxy.changeMessageRead(this.messageNodes[this.messageNodes.length - 1].id).subscribe(f => {

        });
      }
    });
  }
  chatAudio() {
    abp.event.trigger('mediaAudio', this.chatModel);
    this.isMediaChat = true;
  }
  chatVideo() {
    abp.event.trigger('mediaVideo', this.chatModel);
    this.isMediaChat = true;
  }
  pushMessage(node: OnlineMessageNode) {
    this.messageNodes.push(new UserMessageDto({
      fromUserId: node.fromUserId,
      toUserId: node.toUserId,
      id: node.msgId,
      message: node.message,
      messageType: node.messageType,
      courseId: node.courseId,
      creationTime: moment(node.creationTime),
      isRead: false
    }));
    setTimeout(() => {
      $('#m-message').scrollTop(50000);
    }, 100);
  }
  getSelf(node: UserMessageDto) {
    if (node.fromUserId === abp.session.userId) {
      return true;
    }
    return false;
  }

}
