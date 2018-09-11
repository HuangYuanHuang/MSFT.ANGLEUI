import { Component, OnInit } from '@angular/core';
import { CountryPipePipe } from '@shared/pipe/country-pipe';
import { TranslateService } from '@ngx-translate/core';
import { AppConsts } from '@shared/AppConsts';

import {
  UserAspServiceProxy, CountryUserDto, UserDto, FollowerDto,
  FollowerServiceProxy, CreateFollowerDto, UserMessageServiceServiceProxy, CreateUserMessageDto,
} from '@shared/service-proxies/service-proxies';
import { MessageTypeEnum } from '@shared/service-proxies/signalr-online-chat-service';
@Component({
  selector: 'app-followers',
  templateUrl: './followers.component.html',
  styleUrls: ['./followers.component.scss'],

  providers: [CountryPipePipe]

})
export class FollowersComponent implements OnInit {
  countryNodes: CountryUserDto[];
  isLoadFinished = false;
  skipCount = 0;
  maxCount = 20;
  country = '';
  userNodes: FollowerUserDto[] = [];
  userFollowers: FollowerDto[] = [];
  selfId = 0;
  currentUser: UserDto;
  countrySearch;
  isLoad = false;
  constructor(private userAspProxy: UserAspServiceProxy, private followerProxy: FollowerServiceProxy,
    private userMessageProxy: UserMessageServiceServiceProxy,
    private translate: TranslateService) {
    this.selfId = abp.session.userId;
    this.currentUser = AppConsts.currentUser;
  }

  ngOnInit() {
    this.userAspProxy.getCountryUsers().subscribe(d => {
      this.countryNodes = d.items;
      $('#countryPanel').css('overflow', 'hidden');
      this.followerProxy.getUserFollows(abp.session.userId).subscribe(g => {
        this.userFollowers = g.items;
        if (d.items.length > 0) {
          this.getUserByCountry(d.items[0].country);
        }
      });
    });
    $('#countryPanel').mouseover(function () {
      $('#countryPanel').css('overflow', 'auto');
    });
    $('#countryPanel').mouseout(function () {
      $('#countryPanel').css('overflow', 'hidden');
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
          this.userFollowers.push(follower);
        });

      } else {
        item.isSave = false;
        const findIndex = this.userFollowers.findIndex(g => g.userId === abp.session.userId && g.fUserId === item.user.id);
        if (findIndex >= 0) {
          this.userFollowers.splice(findIndex, 1);
        }
      }
    });
  }

  getUserByCountry(country: string) {
    this.skipCount = 0;
    this.maxCount = 20;
    this.country = country;
    this.isLoad = false;
    this.initCountryData();
  }

  initCountryData(isAppend = false) {
    this.userAspProxy.getAll('', this.country, this.skipCount, this.maxCount).subscribe(d => {
      if (!isAppend) {
        this.userNodes = [];
      }
      this.isLoad = true;
      d.items.forEach(f => {
        const follow = new FollowerUserDto(f);
        const findRes = this.userFollowers.filter(g => g.fUserId === f.id);
        if (findRes && findRes.length > 0) {
          follow.isFollow = true;
        }
        this.userNodes.push(follow);
      });
    });
  }
  onScrollDown() {
    this.skipCount += this.maxCount;
    this.initCountryData(true);
  }
  getTransString(country: string) {
    return this.translate.instant('Country.' + country);

  }
  getTransText(country: CountryUserDto) {
    const res = this.translate.instant('Country.' + country.country);
    country.text = res;
    return res;
  }
}

class FollowerUserDto {
  public isFollow = false;
  public isSave = false;
  constructor(public user: UserDto) {

  }
}
