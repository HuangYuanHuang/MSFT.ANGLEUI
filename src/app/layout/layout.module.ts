import { NgModule } from '@angular/core';
import { MomentModule } from 'ngx-moment';

import { LayoutComponent } from './layout.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { HeaderComponent } from './header/header.component';
import { NavsearchComponent } from './header/navsearch/navsearch.component';
import { OffsidebarComponent } from './offsidebar/offsidebar.component';
import { UserblockComponent } from './sidebar/userblock/userblock.component';
import { UserblockService } from './sidebar/userblock/userblock.service';
import { FooterComponent } from './footer/footer.component';
import { MediaComponent } from './media/media.component';
import { NgZorroAntdModule } from 'ng-zorro-antd';

import { AngleSharedModule } from '@angle/shared.module';
import { FollowSidebarComponent } from './follow-sidebar/follow-sidebar.component';

@NgModule({
    imports: [
        AngleSharedModule, NgZorroAntdModule, MomentModule
    ],
    providers: [
        UserblockService
    ],
    declarations: [
        LayoutComponent,
        SidebarComponent,
        UserblockComponent,
        HeaderComponent,
        NavsearchComponent,
        OffsidebarComponent,
        FooterComponent,
        MediaComponent,
        FollowSidebarComponent
    ],
    exports: [
        LayoutComponent,
        SidebarComponent,
        UserblockComponent,
        HeaderComponent,
        NavsearchComponent,
        OffsidebarComponent,
        FooterComponent
    ]
})
export class LayoutModule { }
