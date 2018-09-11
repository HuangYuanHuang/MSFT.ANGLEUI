import { Component, OnInit } from '@angular/core';
import { UserblockService } from './userblock.service';
import { Router } from '@angular/router';
import { UserDto } from '@shared/service-proxies/service-proxies';
import { AppConsts } from '@shared/AppConsts';

@Component({
    selector: 'app-userblock',
    templateUrl: './userblock.component.html',
    styleUrls: ['./userblock.component.scss']
})
export class UserblockComponent implements OnInit {
    user: UserDto = new UserDto();
    constructor(public userblockService: UserblockService, private router: Router) {
        this.user = AppConsts.currentUser;
        if (this.user && !this.user.icon) {
            this.user.icon = 'assets/img/user/01.jpg';
        }

    }

    ngOnInit() {
    }
    setting() {
        this.router.navigate(['/profile/settings']);
    }
    userBlockIsVisible() {
        return this.userblockService.getVisibility();
    }

}
