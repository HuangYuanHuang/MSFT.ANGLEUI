import { Component, ViewContainerRef, Injector, HostBinding, OnInit, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { SettingsService } from './core/settings/settings.service';
@Component({
    selector: 'app-root',
    templateUrl: './app.component.html'

})
export class AppComponent extends AppComponentBase implements OnInit, AfterViewInit {
    @HostBinding('class.layout-fixed') get isFixed() { return this.settings.getLayoutSetting('isFixed'); };
    @HostBinding('class.aside-collapsed') get isCollapsed() { return this.settings.getLayoutSetting('isCollapsed'); };
    @HostBinding('class.layout-boxed') get isBoxed() { return this.settings.getLayoutSetting('isBoxed'); };
    @HostBinding('class.layout-fs') get useFullLayout() { return this.settings.getLayoutSetting('useFullLayout'); };
    @HostBinding('class.hidden-footer') get hiddenFooter() { return this.settings.getLayoutSetting('hiddenFooter'); };
    @HostBinding('class.layout-h') get horizontal() { return this.settings.getLayoutSetting('horizontal'); };
    @HostBinding('class.aside-float') get isFloat() { return this.settings.getLayoutSetting('isFloat'); };
    @HostBinding('class.offsidebar-open') get offsidebarOpen() { return this.settings.getLayoutSetting('offsidebarOpen'); };
    @HostBinding('class.aside-toggled') get asideToggled() { return this.settings.getLayoutSetting('asideToggled'); };
    @HostBinding('class.aside-collapsed-text') get isCollapsedText() { return this.settings.getLayoutSetting('isCollapsedText'); };
    private viewContainerRef: ViewContainerRef;

    constructor(
        injector: Injector, public settings: SettingsService
    ) {
        super(injector);
    }

    ngOnInit(): void {
        //  SignalRAspNetCoreHelper.initSignalR();
        $(document).on('click', '[href="#"]', e => e.preventDefault());
    }

    ngAfterViewInit(): void {
        //  $.AdminBSB.activateAll();
        //   $.AdminBSB.activateDemo();
    }

    onResize(event) {
        // exported from $.AdminBSB.activateAll
        // $.AdminBSB.leftSideBar.setMenuHeight();
        // $.AdminBSB.leftSideBar.checkStatuForResize(false);

        // // exported from $.AdminBSB.activateDemo
        // $.AdminBSB.demo.setSkinListHeightAndScroll();
        // $.AdminBSB.demo.setSettingListHeightAndScroll();
    }
}