import { Component, Injector, ViewChild } from '@angular/core';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { PagedListingComponentBase, PagedRequestDto } from 'shared/paged-listing-component-base';
import {
  AccountManagerServiceProxy,
  UserPublicServiceProxy, AccountDto, PagedResultDtoOfAccountDto, UserDto
} from '@shared/service-proxies/service-proxies';
import { CreateAccountComponent } from './create-account/create-account.component';
import { EditAccountComponent } from './edit-account/edit-account.component';
import { RoleQuerySrarchHelper } from '@shared/helpers/RoleQuerySearchHelper';
import { finalize } from 'rxjs/operators';
import { AppConsts } from '@shared/AppConsts';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-account-manager',
  templateUrl: './account-manager.component.html',
  styleUrls: ['./account-manager.component.css'],
  animations: [appModuleAnimation()]
})
export class AccountManagerComponent extends PagedListingComponentBase<AccountDto> {
  @ViewChild('editAccountModal') editAccountComponent: EditAccountComponent;
  @ViewChild('createAccountModal') createAccountComponent: CreateAccountComponent;
  accounts: AccountDto[];
  country = '';
  school = '';
  isSchoolRole = false;
  constructor(
    injector: Injector, private _userService: UserPublicServiceProxy,
    private accountService: AccountManagerServiceProxy, private translate: TranslateService
  ) {
    super(injector);
    const res = RoleQuerySrarchHelper.GetSearchQuery(AppConsts.currentUser.roleNames[0], AppConsts.currentUser.country,
      AppConsts.currentUser.school);
    this.country = res[0];
    this.school = res[1];
    if (this.school.length > 5) {
      this.isSchoolRole = true;
    }
  }
  protected list(request: PagedRequestDto, pageNumber: number, finishedCallback: Function): void {
    this.requestData(request, pageNumber, finishedCallback);
  }
  requestData(request: PagedRequestDto, pageNumber: number, finishedCallback: Function) {
    this.accountService.getAll(this.country, this.school, request.skipCount, request.maxResultCount)
      .pipe(finalize(() => {
        finishedCallback();
      }))
      .subscribe((result: PagedResultDtoOfAccountDto) => {
        this.accounts = result.items;
        this.showPaging(result, pageNumber);
      });
  }
  protected delete(entity: AccountDto): void {
    abp.message.confirm(
      'Delete Account ' + entity.displayName + '?',
      (result: boolean) => {
        if (result) {
          this.accountService.delete(entity.id)
            .subscribe(() => {
              abp.notify.info('Deleted Account: ' + entity.displayName);
              this.refresh();
            });
        }
      }
    );
  }
  getTransString(country: string) {
    return this.translate.instant('Country.' + country);

  }
  createAccount() {
    this.createAccountComponent.show(this.country, this.school, this.isSchoolRole);
  }
  editAccount(item: AccountDto) {
    this.editAccountComponent.show(item);
  }
}
