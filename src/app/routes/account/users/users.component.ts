import { Component, Injector, ViewChild } from '@angular/core';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { UserServiceProxy, UserDto, PagedResultDtoOfUserDto } from '@shared/service-proxies/service-proxies';
import { PagedListingComponentBase, PagedRequestDto } from 'shared/paged-listing-component-base';
import { CreateUserComponent } from './create-user/create-user.component';
import { EditUserComponent } from './edit-user/edit-user.component';
import { finalize } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';

@Component({
    templateUrl: './users.component.html',
    styleUrls: ['./users.component.css'],
    animations: [appModuleAnimation()]
})
export class UsersComponent extends PagedListingComponentBase<UserDto> {

    @ViewChild('createUserModal') createUserModal: CreateUserComponent;
    @ViewChild('editUserModal') editUserModal: EditUserComponent;
    active = false;
    users: UserDto[] = [];
    opNodes = ['Pages.Users.Delete', 'Pages.Users.Edit'];
    grantedNum = 0;
    constructor(
        injector: Injector,
        private _userService: UserServiceProxy, private translate: TranslateService
    ) {
        super(injector);
        this.opNodes.forEach(d => {
            if (this.isGranted(d)) {
                this.grantedNum++;
            }
        });
    }

    protected list(request: PagedRequestDto, pageNumber: number, finishedCallback: Function): void {
        this._userService.getAll(request.skipCount, request.maxResultCount)
            .pipe(finalize(() => {
                finishedCallback();
            }))
            .subscribe((result: PagedResultDtoOfUserDto) => {
                this.users = result.items;
                this.showPaging(result, pageNumber);
            });
    }
    getTransString(country: string) {
        return this.translate.instant('Country.' + country);

    }
    protected delete(user: UserDto): void {
        abp.message.confirm(
            'Delete user ' + user.fullName + '?',
            (result: boolean) => {
                if (result) {
                    this._userService.delete(user.id)
                        .subscribe(() => {
                            abp.notify.info('Deleted User: ' + user.fullName);
                            this.refresh();
                        });
                }
            }
        );
    }
    // Show Modals
    createUser(): void {
        this.createUserModal.show();
    }

    editUser(user: UserDto): void {
        this.editUserModal.show(user.id);
    }
}
