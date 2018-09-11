import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NgxSelectModule } from 'ngx-select-ex'
import { NgxPaginationModule } from 'ngx-pagination';
import { TagInputModule } from 'ngx-chips';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';

import { AngleSharedModule } from '@angle/shared.module';
import { ListComponent } from './list/list.component';
import { PostComponent } from './post/post.component';
import { ArticlesComponent } from './articles/articles.component';
import { ArticleviewComponent } from './articleview/articleview.component';
import { MomentModule } from 'ngx-moment';
import { CropperComponent } from './cropper/cropper.component';
import { FileUploadModule } from 'ng2-file-upload';
import { ImageCropperModule } from 'ng2-img-cropper';
import { ArticleEditComponent } from './articleedit/articleedit.component';
import { NgZorroAntdModule } from 'ng-zorro-antd';

const routes: Routes = [
    { path: 'list', component: ListComponent },
    { path: 'post/:id', component: PostComponent },
    { path: 'articles', component: ArticlesComponent },
    { path: 'articleview', component: ArticleviewComponent },
    { path: 'articeledit/:id', component: ArticleEditComponent }
];

@NgModule({
    imports: [
        AngleSharedModule, NgxPaginationModule,
        FileUploadModule, ImageCropperModule, InfiniteScrollModule,
        RouterModule.forChild(routes), TagInputModule,
        NgxSelectModule, MomentModule, NgZorroAntdModule
    ],
    declarations: [
        ListComponent,
        PostComponent,
        ArticlesComponent,
        CropperComponent,
        ArticleviewComponent,
        ArticleEditComponent
    ],
    exports: [
        RouterModule
    ]
})
export class BlogModule { }
