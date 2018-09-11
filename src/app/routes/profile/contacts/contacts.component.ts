import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import {
    UserAspServiceProxy, CountryUserDto, UserDto, FollowerDto,
    FollowerServiceProxy, CreateFollowerDto
} from '@shared/service-proxies/service-proxies';
@Component({
    selector: 'app-contacts',
    templateUrl: './contacts.component.html',
    styleUrls: ['./contacts.component.scss']
})
export class ContactsComponent implements OnInit {

    skipCount = 0;
    maxCount = 20;
    userNodes: UserDto[];
    constructor(private followerProxy: FollowerServiceProxy, private _router: Router) { }

    ngOnInit() {
        this.initData();
    }
    onScrollDown() {
        this.skipCount += this.maxCount;
        this.initData();
    }
    initData(isAppend = false) {
        this.followerProxy.getAllFollower(abp.session.userId, this.skipCount, this.maxCount).subscribe(d => {
            if (isAppend) {
                d.items.forEach(g => {
                    this.userNodes.push(g);
                });
            } else {
                this.userNodes = d.items;

            }
        });
    }
    sendMessage(item: UserDto) {
        this._router.navigate(['/profile/chat/' + item.id]);

    }
}
