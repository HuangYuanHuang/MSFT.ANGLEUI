import { Component, OnInit, Injector, ViewChild } from '@angular/core';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { PagedListingComponentBase, PagedRequestDto } from 'shared/paged-listing-component-base';
import { SchoolServiceProxy, SchoolDto, PagedResultDtoOfSchoolDto, UserPublicServiceProxy } from '@shared/service-proxies/service-proxies';
import { EditSchoolComponent } from './edit-school/edit-school.component';
import { CreateSchoolComponent } from './create-school/create-school.component';
import { RoleQuerySrarchHelper } from '@shared/helpers/RoleQuerySearchHelper';
import { finalize } from 'rxjs/operators';
import { AppConsts } from '@shared/AppConsts';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-school',
  templateUrl: './school.component.html',
  styleUrls: ['./school.component.css'],
  animations: [appModuleAnimation()]
})
export class SchoolComponent extends PagedListingComponentBase<SchoolDto>  {
  @ViewChild('editSchoolModal') editSchoolComponent: EditSchoolComponent;
  @ViewChild('createSchoolModal') createSchoolComponent: CreateSchoolComponent;

  private country = '';
  private school = '';
  schools: SchoolDto[];
  opNodes = ['Pages.Schools.Delete', 'Pages.Schools.Edit'];
  grantedNum = 0;
  constructor(
    injector: Injector,
    private schoolService: SchoolServiceProxy, private _userService: UserPublicServiceProxy, private translate: TranslateService
  ) {
    super(injector);
    this.opNodes.forEach(d => {
      if (this.isGranted(d)) {
        this.grantedNum++;
      }
    });
    const res = RoleQuerySrarchHelper.GetSearchQuery(AppConsts.currentUser.roleNames[0], AppConsts.currentUser.country,
      AppConsts.currentUser.school);
    this.country = res[0];
    this.school = res[1];
  }
  protected list(request: PagedRequestDto, pageNumber: number, finishedCallback: Function): void {
    this.requestData(request, pageNumber, finishedCallback);
  }
  requestData(request: PagedRequestDto, pageNumber: number, finishedCallback: Function) {
    this.schoolService.getAll(this.country, this.school, request.skipCount, request.maxResultCount)
      .pipe(finalize(() => {
        finishedCallback();
      }))
      .subscribe((result: PagedResultDtoOfSchoolDto) => {
        this.schools = result.items;
        this.showPaging(result, pageNumber);
      });
  }
  protected delete(entity: SchoolDto): void {
    abp.message.confirm(
      'Delete School ' + entity.schoolName + '?',
      (result: boolean) => {
        if (result) {
          this.schoolService.delete(entity.id)
            .subscribe(() => {
              abp.notify.info('Deleted School: ' + entity.schoolName);
              this.refresh();
            });
        }
      }
    );
  }
  getTransString(country: string) {
    return this.translate.instant('Country.' + country);

  }
  editSchool(item: SchoolDto) {
    this.editSchoolComponent.show(item);
  }
  createSchool() {
    this.createSchoolComponent.show(this.country);
  }
}
