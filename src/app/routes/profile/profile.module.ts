import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { AngleSharedModule } from '@angle/shared.module';
import { SignalrOnlineChatService } from '@shared/service-proxies/signalr-online-chat-service';
import { FollowersComponent } from './followers/followers.component';
import { ContactsComponent } from './contacts/contacts.component';
import { MomentModule } from 'ngx-moment';
import { ChatComponent } from './chat/chat.component';
import { ChatListComponent } from './chat/chat-list/chat-list.component';
import { ChatPanelComponent } from './chat/chat-panel/chat-panel.component';
import { ChatInfoComponent } from './chat/chat-info/chat-info.component';
import { CountryPipePipe } from '@shared/pipe/country-pipe';
import { NamePipe } from '@shared/pipe/name-pipe';

import { SettingsComponent } from './settings/settings.component';
import { CropperComponent } from './cropper/cropper.component';
import { ImageCropperModule } from 'ng2-img-cropper';
import { NgZorroAntdModule } from 'ng-zorro-antd';

const routes: Routes = [
  { path: 'followers', component: FollowersComponent },
  { path: 'contacts', component: ContactsComponent },
  { path: 'chat', component: ChatComponent },
  { path: 'chat/:id', component: ChatComponent },
  { path: 'settings', component: SettingsComponent }
];

@NgModule({
  imports: [
    AngleSharedModule,
    InfiniteScrollModule, ImageCropperModule,
    RouterModule.forChild(routes),
    MomentModule, NgZorroAntdModule
  ],
  declarations: [CountryPipePipe, NamePipe,
    FollowersComponent,
    ContactsComponent,
    ChatComponent,
    ChatListComponent,
    ChatPanelComponent,
    ChatInfoComponent,
    SettingsComponent,
    CropperComponent
  ],
  providers: [SignalrOnlineChatService],
  exports: [
    RouterModule
  ]
})
export class ProfileModule { }
