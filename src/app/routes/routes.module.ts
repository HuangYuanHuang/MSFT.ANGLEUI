import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslatorService } from '../core/translator/translator.service';
import { MenuService } from '../core/menu/menu.service';
import { AngleSharedModule } from '@angle/shared.module';
import { menu } from './menu';
import { routes } from './routes';
import { PagesModule } from './pages/pages.module';

@NgModule({
    imports: [
        AngleSharedModule, PagesModule,
        RouterModule.forRoot(routes)
    ],
    declarations: [],
    exports: [
        RouterModule
    ]
})

export class RoutesModule {
    constructor(public menuService: MenuService, tr: TranslatorService) {
        menuService.addMenu(menu);
    }
}
