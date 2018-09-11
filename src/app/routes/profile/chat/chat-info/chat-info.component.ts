import { Component, OnInit } from '@angular/core';
import { UserDto } from '@shared/service-proxies/service-proxies';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-chat-info',
  templateUrl: './chat-info.component.html',
  styleUrls: ['./chat-info.component.css']
})
export class ChatInfoComponent implements OnInit {
  currentUser: UserDto = new UserDto();

  constructor(private translate: TranslateService) { }

  ngOnInit() {
  }
  getTransString(country: string) {
    return this.translate.instant('Country.' + country);

  }
  setUser(user: UserDto) {
    this.currentUser = user;
  }
}
