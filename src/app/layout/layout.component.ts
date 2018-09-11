import { Component, OnInit } from '@angular/core';
import { UserAspServiceProxy } from '@shared/service-proxies/service-proxies';
import { SignalrOnlineChatService } from '@shared/service-proxies/signalr-online-chat-service';

import { AppConsts } from '@shared/AppConsts';
@Component({
    selector: 'app-layout',
    templateUrl: './layout.component.html',
    styleUrls: ['./layout.component.scss']
})
export class LayoutComponent implements OnInit {
    loadFinished = false;
    constructor(private userAspService: UserAspServiceProxy, private signalrOnline: SignalrOnlineChatService) {
        this.userAspService.get(abp.session.userId).subscribe(d => {
            AppConsts.currentUser = d;
            this.loadFinished = true;
            this.signalrOnline.init(d);
        });
    }

    ngOnInit() {
    }

}
