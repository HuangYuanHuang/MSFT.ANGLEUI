import { MenuItem } from './layout/menu-item';
export const menuItems: MenuItem[] = [
    new MenuItem('HomePage', '', 'home', '/app/home'),

    // new MenuItem(this.l('Tenants'), 'Pages.Tenants', 'business', '/app/tenants'),
    new MenuItem('Users', 'Pages.Users', 'people', '/app/users'),
    new MenuItem('ASPnet Account', 'Pages.AspUsers', 'people', '/app/aspusers'),

    new MenuItem('Roles', 'Pages.Roles', 'local_offer', '/app/roles'),
    new MenuItem('Courses', 'Pages.Courses', 'info', '/app/live'),
    new MenuItem('Schools', 'Pages.Schools', 'info', '/app/school'),
    new MenuItem('Accounts', '', 'info', '/app/account'),
    new MenuItem('News', '', 'info', '/app/news'),

    new MenuItem('About', '', 'info', '/app/about'),

    // new MenuItem('MultiLevelMenu', '', 'menu', '', [
    //     new MenuItem('ASP.NET Boilerplate', '', '', '', [
    //         new MenuItem('Home', '', '', 'https://aspnetboilerplate.com/?ref=abptmpl'),
    //         new MenuItem('Templates', '', '', 'https://aspnetboilerplate.com/Templates?ref=abptmpl'),
    //         new MenuItem('Samples', '', '', 'https://aspnetboilerplate.com/Samples?ref=abptmpl'),
    //         new MenuItem('Documents', '', '', 'https://aspnetboilerplate.com/Pages/Documents?ref=abptmpl')
    //     ]),
    //     new MenuItem('ASP.NET Zero', '', '', '', [
    //         new MenuItem('Home', '', '', 'https://aspnetzero.com?ref=abptmpl'),
    //         new MenuItem('Description', '', '', 'https://aspnetzero.com/?ref=abptmpl#description'),
    //         new MenuItem('Features', '', '', 'https://aspnetzero.com/?ref=abptmpl#features'),
    //         new MenuItem('Pricing', '', '', 'https://aspnetzero.com/?ref=abptmpl#pricing'),
    //         new MenuItem('Faq', 'sd', '', 'https://aspnetzero.com/Faq?ref=abptmpl'),
    //         new MenuItem('Documents', '', '', 'https://aspnetzero.com/Documents?ref=abptmpl')
    //     ])
    // ])
];
