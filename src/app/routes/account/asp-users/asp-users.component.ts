
import { Component, Injector, ViewChild } from '@angular/core';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { UserAspServiceProxy, UserDto, PagedResultDtoOfUserDto } from '@shared/service-proxies/service-proxies';
import { PagedListingComponentBase, PagedRequestDto } from 'shared/paged-listing-component-base';
import { CreateAspUserComponent } from './create-asp-user/create-asp-user.component';
import { EditAspUserComponent } from './edit-asp-user/edit-asp-user.component';
import { finalize } from 'rxjs/operators';
import { AppConsts } from '@shared/AppConsts';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-asp-users',
  templateUrl: './asp-users.component.html',
  styleUrls: ['./asp-users.component.css'],
  animations: [appModuleAnimation()]
})
export class AspUsersComponent extends PagedListingComponentBase<UserDto> {

  @ViewChild('createUserModal') createUserModal: CreateAspUserComponent;
  @ViewChild('editUserModal') editUserModal: EditAspUserComponent;

  active = false;
  users: UserDto[] = [];
  opNodes = ['Pages.AspUsers.Delete', 'Pages.AspUsers.Edit'];
  grantedNum = 0;
  roles = ['ASPnet CMC', 'Country Coordinator', 'School Coordinator'];
  currentRole = '';
  nextRole = '';
  country = '';
  searchContry = '';
  constructor(
    injector: Injector,
    private _userService: UserAspServiceProxy, private translate: TranslateService
  ) {
    super(injector);
    this.opNodes.forEach(d => {
      if (this.isGranted(d)) {
        this.grantedNum++;
      }
    });
    this.country = AppConsts.currentUser.country;
    this.searchContry = AppConsts.currentUser.country;
    if (AppConsts.currentUser.roleNames[0].toUpperCase() === 'Admin'.toUpperCase()) {
      this.nextRole = this.roles[0];
      this.currentRole = '';
      this.searchContry = '';
    } else {
      const index = this.roles.findIndex(f => f.toUpperCase() === AppConsts.currentUser.roleNames[0].toUpperCase());
      if (index >= 0) {
        this.nextRole = this.roles[index + 1];
        this.currentRole = this.roles[index + 1];
        if (index === 0) {
          this.searchContry = '';
        }
      }
    }
  }
  getTransString(country: string) {
    return this.translate.instant('Country.' + country);

  }
  protected list(request: PagedRequestDto, pageNumber: number, finishedCallback: Function): void {
    this.requestData(request, pageNumber, finishedCallback);
  }
  requestData(request: PagedRequestDto, pageNumber: number, finishedCallback: Function) {
    this._userService.getAll(this.currentRole, this.searchContry, request.skipCount, request.maxResultCount)
      .pipe(finalize(() => {
        finishedCallback();
      }))
      .subscribe((result: PagedResultDtoOfUserDto) => {
        this.users = result.items;
        this.showPaging(result, pageNumber);
      });
  }
  protected delete(user: UserDto): void {
    abp.message.confirm(
      'Delete user ' + user.fullName + '?',
      (result: boolean) => {
        if (result) {
          this._userService.delete(user.id)
            .subscribe(() => {
              abp.notify.info('Deleted User:' + user.fullName);
              this.refresh();
            });
        }
      }
    );
  }

  // Show Modals
  createUser(): void {
    this.createUserModal.show(this.nextRole, this.country);
  }

  editUser(user: UserDto): void {
    this.editUserModal.show(user);
  }
}
