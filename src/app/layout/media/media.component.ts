import { Component, OnInit } from '@angular/core';
import { UserDto, UserMessageServiceServiceProxy, CreateUserMessageDto } from '@shared/service-proxies/service-proxies';
import { AgoraService, SubjectVideo, AgoraEnum, AgoraVideoNode, AgoraInitModel } from '@shared/service-proxies/agora-service';
import {
  ChatStautsEnum, MessageTypeEnum, UserChatModel, OnlineMessageNode,
  SignalrOnlineChatService
} from '@shared/service-proxies/signalr-online-chat-service';
import { TranslateService } from '@ngx-translate/core';
import * as moment from 'moment';

import { AppConsts } from '@shared/AppConsts';
@Component({
  selector: 'app-media',
  templateUrl: './media.component.html',
  styleUrls: ['./media.component.css']
})
export class MediaComponent implements OnInit {
  visible = false;
  currentChatUser: UserDto = new UserDto();
  localVideoNode: AgoraVideoNode;
  remoteVideoNode: AgoraVideoNode;
  chatStatus: ChatStautsEnum = ChatStautsEnum.Invitation;
  videoChat = false;
  durnTime = moment({ hour: 0, minute: 0, seconds: 0 });  // today, 5:10.20.000();
  totalSeconds = 0;
  durnInter = null;
  timeoutMedia = false;
  inTheCall = false;
  constructor(private agora: AgoraService, private signalRService: SignalrOnlineChatService,
    private userMessageProxy: UserMessageServiceServiceProxy, private transService: TranslateService) {
    this.initAgora();
  }

  ngOnInit() {
    abp.event.on('mediaPanel', (data) => {
      this.visible = !this.visible;
    });
    abp.event.on('mediaVideo', (node: UserChatModel ) => {
      this.registerEvent(node, true);
      this.videoChat = true;
      this.divOperation();
      this.inTheCall = true;
    });
    abp.event.on('callInvitation', (node: any) => {
      this.inTheCall = true;
    });
    abp.event.on('mediaAudio', (node: UserChatModel ) => {
      this.registerEvent(node, false);
      this.videoChat = false;
      this.divOperation();
      this.inTheCall = true;
    });
    abp.event.on('callAccept', (node: OnlineMessageNode) => {
      this.chatStatus = ChatStautsEnum.Accept;
      this.videoChat = node.messageType === MessageTypeEnum.Video;
      this.inTheCall = false;
      this.agora.agoraInit(new AgoraInitModel(abp.session.userId, node.message, true, this.videoChat));
      this.signalRService.getUserInfoById(node.fromUserId, (d: UserDto) => {
        this.currentChatUser = d;
        this.visible = true;

        if (this.videoChat) {
          setTimeout(() => {
            $('.video-operation').hide();
            this.divOperation();
          }, 5000);

        }
      });
    });
    abp.event.on('callRefuse', (node: OnlineMessageNode) => {
      this.inTheCall = false;
      const messageDto = new CreateUserMessageDto({
        id: 0,
        fromUserId: node.toUserId,
        toUserId: node.fromUserId,
        message: 'Refuse',
        courseId: node.courseId,
        messageType: MessageTypeEnum.Refuse
      });
      this.userMessageProxy.create(messageDto).subscribe(d => {
        messageDto.messageType = MessageTypeEnum.System;
        messageDto.message = 'Call declined';
        this.userMessageProxy.create(messageDto).subscribe(g => {
          abp.event.trigger('mediaChatLog', g);
        });
      });
    });
    abp.event.on('remoteCallCloseRefuse', (node: OnlineMessageNode) => {
      this.inTheCall = false;
      const message = node.messageType === MessageTypeEnum.Close ? this.transService.instant('Chat.CallEnd')
        : this.transService.instant('Chat.Refusedtocall');
      this.signalRService.userNotify(node.fromUserId, message);
      this.visible = false;
      this.timeoutMedia = true;
      abp.event.trigger('mediaChatClose', 'Over');
      if (this.localVideoNode) {
        this.localVideoNode.stop();
        this.localVideoNode = null;
        setTimeout(() => {
          abp.event.trigger('mediaChatOver', 'Over');
          if (this.durnInter) {
            clearInterval(this.durnInter);
          }
        }, 5000);
      } else {
        abp.event.trigger('userCancel', node);
      }
    });


  }
  playSeconds() {
    this.totalSeconds = 0;
    this.durnTime = moment({ hour: 0, minute: 0, seconds: 0 });
    if (this.durnInter) {
      clearInterval(this.durnInter);
    }
    this.durnInter = setInterval(() => {
      this.totalSeconds++;
      const hour = parseInt((this.totalSeconds / 3600) + '', 0);
      const minute = parseInt(((this.totalSeconds - hour * 3600) / 60) + '', 0);
      const seconds = this.totalSeconds - hour * 3600 - minute * 60;
      this.durnTime = moment({ hour: hour, minute: minute, seconds: seconds });
    }, 1000);
  }
  playVideo() {
    this.localVideoNode.playVideo();
  }
  playAudio() {
    this.localVideoNode.playAudio();
  }
  closeMedia(info = 'Call Ended') {
    this.inTheCall = false;
    let toUserId = 0;
    if (this.remoteVideoNode) {
      toUserId = this.remoteVideoNode.getStreamId();
    } else {
      toUserId = this.currentChatUser.id;
    }
    const messDto = new CreateUserMessageDto({
      id: 0,
      fromUserId: abp.session.userId,
      toUserId: toUserId,
      message: 'Close',
      courseId: 'Peer-Peer',
      messageType: MessageTypeEnum.Close
    });
    this.userMessageProxy.create(messDto).subscribe(d => {
      if (this.localVideoNode) {
        this.localVideoNode.stop();
      }
      abp.event.trigger('mediaChatClose', 'Over');
      this.localVideoNode = null;
      this.visible = false;
      messDto.messageType = MessageTypeEnum.System;
      messDto.message = info;
      this.userMessageProxy.create(messDto).subscribe(g => {
        abp.event.trigger('mediaChatLog', g);
      });
      setTimeout(() => {
        abp.event.trigger('mediaChatOver', 'Over');
        if (this.durnInter) {
          clearInterval(this.durnInter);
        }
      }, 5000);
    });
  }
  registerEvent(node: UserChatModel , isVideo: boolean) {
    this.visible = true;
    this.currentChatUser = node.user;
    this.chatStatus = ChatStautsEnum.Invitation;
    const channel = this.agora.GetGUID();
    const messageDto = new CreateUserMessageDto({
      id: 0,
      fromUserId: abp.session.userId,
      toUserId: node.user.id,
      message: channel,
      courseId: 'Peer-Peer',
      messageType: isVideo ? MessageTypeEnum.Video : MessageTypeEnum.Audio
    });
    this.userMessageProxy.create(messageDto).subscribe(d => {
      this.timeoutMedia = false;
      setTimeout(() => {
        if (!this.timeoutMedia) {
          this.closeMedia('Timeout');
          this.inTheCall = false;
        }
      }, 30000);
      this.agora.agoraInit(new AgoraInitModel(abp.session.userId, channel, true, isVideo));
      // messageDto.messageType = MessageTypeEnum.System;
      // messageDto.message = 'Call Invitation';
      // this.userMessageProxy.create(messageDto).subscribe(g => {
      //   abp.event.trigger('mediaChatLog', g);
      // });
    })
  }

  audioStyle() {
    // this.currentChatUser.icon = 'https://unescoedu.hyhrobot.com:5200/static-image/Icon/bdcad313-8b20-4f2d-8291-c0c512cd683b.jpg';
    if (this.currentChatUser.icon) {
      return {
        'background-image': `url(${this.currentChatUser.icon})`,
      };
    }
  }
  initAgora() {
    this.agora.changeVideOb.subscribe(node => {
      const subject = node as SubjectVideo;
      if (subject.is_local) {
        this.localVideoNode = this.agora.localVideo;
        subject.videNode.play();
        $('.video-operation').show();
        abp.event.trigger('mediaChatBegin', 'Begin');

      } else if (!subject.is_local && subject.aogra === AgoraEnum.Connect) {
        this.remoteVideoNode = subject.videNode;
        this.chatStatus = ChatStautsEnum.Accept;
        this.inTheCall = false;
        this.timeoutMedia = true;
        this.playSeconds();
        this.remoteVideoNode.play();
        if (this.videoChat) {
          setTimeout(() => {
            $('.video-operation').hide();
            this.divOperation();
          }, 5000);
        }
      }
    });
  }
  divOperation() {

    $('.media-main').on('mouseover', () => {
      if (this.chatStatus === ChatStautsEnum.Accept && this.videoChat) {
        $('.video-operation').show();
      }
    });
    $('.media-main').on('mouseout', () => {
      if (this.chatStatus === ChatStautsEnum.Accept && this.videoChat) {
        $('.video-operation').hide();
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
