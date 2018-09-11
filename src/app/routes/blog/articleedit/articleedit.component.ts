import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NewInfoServiceProxy, CreateNewInfoDto, NewInfoDto, UpdateNewInfoDto } from '@shared/service-proxies/service-proxies';
import { CropperComponent } from '../cropper/cropper.component';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';

declare var $: any;

@Component({
    selector: 'app-articleedit',
    templateUrl: './articleedit.component.html',
    styleUrls: ['./articleedit.component.scss']
})
export class ArticleEditComponent implements OnInit {

    //  @ViewChild('cropper') cropperComponet: CropperComponent;
    public itemsCategories: Array<string> = ['Top story', 'News', 'Mark your Agenda', 'Arts Contest', 'Schools Celebrating',
        'Essential Reading'];
    tags = [];
    categories;
    newInfo = new UpdateNewInfoDto();
    valForm: FormGroup;
    constructor(fb: FormBuilder, private route: ActivatedRoute, private newProxy: NewInfoServiceProxy, private _router: Router) {
        this.valForm = fb.group({
            'article-title': [null, Validators.compose([Validators.required])],
            'article-notes': [null, Validators.compose([Validators.required])]
        });
    }

    ngOnInit() {
        $('#summernote').summernote({
            height: 360,
            dialogsInBody: true,
            callbacks: {
                onChange: (contents, $editable) => {

                    this.newInfo.context = contents;
                }
            }
        });

        // Hide the initial popovers that display
        $('.note-popover').css({
            'display': 'none'
        });
        const id = this.route.snapshot.params['id'];
        this.newProxy.get(id).subscribe(res => {
            this.newInfo = new UpdateNewInfoDto();
            this.newInfo.id = res.id;
            this.newInfo.notes = res.notes;
            this.newInfo.seoDescription = res.seoDescription;
            this.newInfo.seoTitle = res.seoTitle;
            this.newInfo.keywords = res.keywords;
            this.newInfo.title = res.title;
            this.tags = res.tags.split(',');
            this.categories = res.type.split(',');
            $('#summernote').summernote('code', res.context);
        });
    }

    submitForm($ev, value: any) {
        $ev.preventDefault();
        // tslint:disable-next-line:forin
        for (const c in this.valForm.controls) {
            this.valForm.controls[c].markAsTouched();
        }
        if (this.valForm.valid) {
            if (this.tags.length > 0) {
                const tagArr = [];
                this.tags.forEach(d => {
                    tagArr.push(d.value || d);
                });
                this.newInfo.tags = tagArr.join();

            }
            this.newInfo.type = this.categories.join();
            this.newInfo.status = 1;
            this.newProxy.update(this.newInfo).subscribe(d => {
                abp.notify.success('Update Article Success');
                setTimeout(() => {
                    this._router.navigate(['/blog/articles']);
                }, 1000);

            });
        }
    }

}
