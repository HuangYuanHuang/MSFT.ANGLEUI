import { LayoutComponent } from '../layout/layout.component';
import { LoginComponent } from './pages/login/login.component';


export const routes = [

    {
        path: '',
        component: LayoutComponent,
        children: [
            { path: '', redirectTo: 'home', pathMatch: 'full', },
            { path: 'home', loadChildren: './home/home.module#HomeModule' },
            { path: 'blog', loadChildren: './blog/blog.module#BlogModule' },
            { path: 'profile', loadChildren: './profile/profile.module#ProfileModule' },
            { path: 'account', loadChildren: './account/account.module#AccountModule' },
        ]
    },
    { path: 'login', component: LoginComponent },
    // Not found
    { path: '**', redirectTo: 'home' }

];
