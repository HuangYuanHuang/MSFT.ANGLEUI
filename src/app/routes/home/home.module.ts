import { NgModule } from '@angular/core';
import { HomeComponent } from './home/home.component';
import { Routes, RouterModule } from '@angular/router';
import { AppRouteGuard } from '@shared/auth/auth-route-guard';
import { AngleSharedModule } from '@angle/shared.module';
import { VectorComponent } from './vector/vector.component';
import { ProfileComponent } from './profile/profile.component';
import { MailboxComponent } from './mailbox/mailbox.component';
import { FolderComponent } from './mailbox/folder/folder.component';
import { ViewComponent } from './mailbox/view/view.component';
import { AboutNetworkComponent } from './about-network/about-network.component';
import { MembershipComponent } from './membership/membership.component';
import { WorldActionComponent } from './world-action/world-action.component';
import { ComposeComponent } from './mailbox/compose/compose.component';
import { CalendarComponent } from './calendar/calendar.component';
import { ProjectsdetailsComponent } from './projectsdetails/projectsdetails.component';
const routes: Routes = [
    { path: '', component: ProfileComponent, canActivate: [AppRouteGuard] },
    { path: 'dashboard', component: ProfileComponent, canActivate: [AppRouteGuard] },
    { path: 'vector', component: VectorComponent },
    {
        path: 'mailbox', component: MailboxComponent,
        children: [
            { path: '', redirectTo: 'folder/inbox' },
            { path: 'folder/:folder', component: FolderComponent },
            { path: 'view/:mid', component: ViewComponent },
            { path: 'compose', component: ComposeComponent }
        ]
    },
    { path: 'calendar', component: CalendarComponent },
    { path: 'broadcast', component: ProjectsdetailsComponent },
    { path: 'coordinators', component: HomeComponent },
    { path: 'memberschools', component: HomeComponent },
    { path: 'aboutnetwork', component: AboutNetworkComponent },
    { path: 'membership', component: MembershipComponent },
    { path: 'worldaction', component: WorldActionComponent }
];

@NgModule({
    imports: [AngleSharedModule,
        RouterModule.forChild(routes),
    ],
    declarations: [
        HomeComponent, CalendarComponent, ProjectsdetailsComponent, AboutNetworkComponent,
        MembershipComponent,
        WorldActionComponent,
        ProfileComponent, MailboxComponent, FolderComponent, ViewComponent, ComposeComponent,
        VectorComponent],
    exports: [
        RouterModule
    ]
})
export class HomeModule { }
