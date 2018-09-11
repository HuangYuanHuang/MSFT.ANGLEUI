import { Injectable, Inject } from '@angular/core';
import { AppConsts } from '@shared/AppConsts';
import { Subject } from 'rxjs/Subject';
@Injectable()
export class AgoraService {
  private client: any;
  private localStream: any;

  public localVideo: AgoraVideoNode;
  public subjectVideo = new Subject<SubjectVideo>();
  public changeVideOb;
  constructor() {
    this.changeVideOb = this.subjectVideo.asObservable();
  //  AgoraRTC.Logger.setLogLevel(AgoraRTC.Logger.ERROR);
  }

  agoraInit(model: AgoraInitModel) {
    this.client = AgoraRTC.createClient({ mode: 'interop' });
    this.client.init(AppConsts.AgoraId, () => {
      this.client.join(null, model.channel, model.userId, (uid) => {
        console.log('User ' + uid + ' join channel successfully');
        this.localStream = AgoraRTC.createStream({ streamID: uid, audio: model.audio, video: model.video, screen: false });
        this.localStream.setVideoProfile('240P');
        this.localStream.init(() => {
          console.log('localStram init');
          const videoNode = new AgoraVideoNode(this.localStream);
          this.localVideo = videoNode;
          this.subjectVideo.next(new SubjectVideo(videoNode, AgoraEnum.Connect, true));
          this.client.publish(this.localStream, (err) => console.log(err));
        });
        this.localStream.on('accessAllowed', function () {
          this.accessAllowed = true;
          console.log('accessAllowed');
        });
        this.localStream.on('accessDenied', function () {
          console.log('accessDenied');
        });
      });
    });
    this.agoraEventInit();
  }
  public GetGUID() {
    let guid = '';
    for (let i = 1; i <= 32; i++) {
      const n = Math.floor(Math.random() * 16.0).toString(16);
      guid += n;
      if ((i === 8) || (i === 12) || (i === 16) || (i === 20)) {
        guid += '-';
      }
    }
    return guid;
  }
  private agoraEventInit() {
    this.client.on('stream-published', (d) => console.log('Publish local stream successfully'));
    this.client.on('stream-added', (evt) => {
      const stream = evt.stream;
      console.log('New stream added: ' + stream.getId());
      this.client.subscribe(stream, function (err) {
        console.log('Subscribe stream failed', err);
      });
    });
    this.client.on('error', function (err) {
      console.log('Got error msg:', err.reason);
    });
    this.client.on('stream-removed', (evt) => this.streamRemove(evt));
    this.client.on('peer-leave', (evt) => this.streamRemove(evt));
    this.client.on('stream-subscribed', (evt) => {
      const stream = evt.stream;
      console.log('Subscribe remote stream successfully: ' + stream.getId());
      if (stream.getId() === this.localStream.getId()) {
        return;
      }
      const videoNode = new AgoraVideoNode(stream);
      this.subjectVideo.next(new SubjectVideo(videoNode, AgoraEnum.Connect, false));
    });

  }

  private streamRemove(evt) {
    const stream = evt.stream;

    stream.stop();
    const videoNode = new AgoraVideoNode(stream);

    const isLocal = stream.getId() === this.localStream.getId();

    this.subjectVideo.next(new SubjectVideo(videoNode, AgoraEnum.DisConnect, isLocal));
    console.log('Remote stream is removed ' + stream.getId());


  }
}

export class AgoraVideoNode {
  public userDetail: any;
  public isPlayVideo = true;
  public isPlayAudio = true;
  public videoBtnClass = 'btn-primary';
  public audioBtnClass = 'btn-primary';
  public videoIonClass = 'fa-video';
  public audioIonClass = 'fa-microphone';
  constructor(public stream: any) {

  }

  getStreamId() {
    return this.stream.getId();
  }

  playVideo() {
    this.isPlayVideo = !this.isPlayVideo;
    if (this.isPlayVideo) {
      this.stream.enableVideo();
      this.videoBtnClass = 'btn-primary';
      this.videoIonClass = 'fa-video';
    } else {
      this.stream.disableVideo();
      this.videoBtnClass = 'btn-danger';
      this.videoIonClass = 'fa-video-slash';
    }
  }
  playAudio() {
    this.isPlayAudio = !this.isPlayAudio;
    if (this.isPlayAudio) {
      this.stream.enableAudio();
      this.audioBtnClass = 'btn-primary';
      this.audioIonClass = 'fa-microphone';
    } else {
      this.audioBtnClass = 'btn-danger';
      this.audioIonClass = 'fa-microphone-slash';
      this.stream.disableAudio();
    }
  }

  play() {
    console.log('stream is play');
    setTimeout(() => {
      this.stream.play(this.getStreamId());
    }, 2000);
  }
  stop() {
    console.log('stream is stop');
    this.stream.stop();
    this.stream.close();
  }
}

export class SubjectVideo {
  constructor(public videNode: AgoraVideoNode, public aogra: AgoraEnum, public is_local: boolean) { }
}

export enum AgoraEnum {
  Connect,
  DisConnect
}

export class AgoraInitModel {
  constructor(public userId: any, public channel: string,
     public audio: boolean, public video: boolean) {

  }
}
