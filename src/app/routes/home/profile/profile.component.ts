import { Component, OnInit } from '@angular/core';
import { AppConsts } from '@shared/AppConsts';
import { UserDto } from '@shared/service-proxies/service-proxies';
@Component({
    selector: 'app-profile',
    templateUrl: './profile.component.html',
    styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

    lat = 33.790807;
    lng = -117.835734;
    zoom = 14;
    scrollwheel = false;
    currentUser: UserDto;
    constructor() { }

    ngOnInit() {
        this.currentUser = AppConsts.currentUser;
    }

}
