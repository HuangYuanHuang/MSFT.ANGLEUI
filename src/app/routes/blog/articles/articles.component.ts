import { Component, OnInit, Injector } from '@angular/core';
import { NewInfoServiceProxy, UserAspServiceProxy, NewInfoDto, PagedResultDtoOfNewInfoDto } from '@shared/service-proxies/service-proxies';
import { PagedListingComponentBase, PagedRequestDto } from '@shared/paged-listing-component-base';
import { Router } from '@angular/router';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-articles',
  templateUrl: './articles.component.html',
  styleUrls: ['./articles.component.scss'],
  animations: [appModuleAnimation()]
})
export class ArticlesComponent extends PagedListingComponentBase<NewInfoDto> {

  news: NewInfoDto[];
  isFirst = true;
  userId = -1;
  constructor(
    injector: Injector,
    private _router: Router,
    private newProxy: NewInfoServiceProxy, private userAspProxy: UserAspServiceProxy
  ) {
    super(injector);

  }
  protected list(request: PagedRequestDto, pageNumber: number, finishedCallback: Function): void {
    if (this.isFirst) {
      this.userAspProxy.get(abp.session.userId).subscribe(d => {
        this.isFirst = false;
        if (d.roleNames.length > 0) {
          const role = d.roleNames[0].toUpperCase();
          if (!(role.includes('Admin'.toUpperCase()) || role.includes('aspnet'.toUpperCase()))) {
            this.userId = abp.session.userId;
          }
        } else {
          this.userId = abp.session.userId;
        }
        this.loadData(request, pageNumber, finishedCallback);
      })
    } else {
      this.loadData(request, pageNumber, finishedCallback);
    }

  }
  loadData(request: PagedRequestDto, pageNumber: number, finishedCallback: Function) {
    this.newProxy.getAll('', this.userId, -1, request.skipCount, request.maxResultCount)
      .pipe(finalize(() => {
        finishedCallback();
      }))
      .subscribe((result: PagedResultDtoOfNewInfoDto) => {
        this.news = result.items;
        this.showPaging(result, pageNumber);
      });
  }
  linkArticle(item: NewInfoDto) {
    this._router.navigate(['/blog/post/' + item.id]);
  }
  getTags(item: NewInfoDto): string[] {
    if (item.tags) {
      return item.tags.split(',');

    }
    return [];
  }
  protected delete(entity: NewInfoDto): void {
    setTimeout(() => {

      $('.swal-footer').css('text-align', 'center');
    }, 100);
    abp.message.confirm(
      'Delete News ' + entity.title + '?',
      (result: boolean) => {
        if (result) {
          this.newProxy.delete(entity.id)
            .subscribe(() => {
              abp.notify.info('Deleted News: ' + entity.title);
              this.refresh();
            });
        }
      }
    );
  }
  getStatusStr(item: NewInfoDto) {
    if (item.status === 0) {
      return 'Reject';
    } else if (item.status === 2) {
      return 'Public';
    } else {
      return 'Pending';
    }
  }
  change(item: NewInfoDto, status: number, title: string) {
    setTimeout(() => {

      $('.swal-footer').css('text-align', 'center');
    }, 100);
    abp.message.confirm(
      'Change Status ' + item.title + title + ' ?',
      (result: boolean) => {
        if (result) {
          this.newProxy.changeNewsStatus(item.id, status)
            .subscribe(() => {
              abp.notify.info('Change News: ' + item.title);
              this.refresh();
            });
        }
      }
    );
  }
  editNew(item: NewInfoDto) {
    this._router.navigate(['/blog/articeledit', item.id]);
  }

}
