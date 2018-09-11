import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NewInfoServiceProxy, CreateNewInfoDto, NewInfoDto } from '@shared/service-proxies/service-proxies';
import { Router } from '@angular/router';
import { CropperComponent } from '../cropper/cropper.component';

declare var $: any;

@Component({
    selector: 'app-articleview',
    templateUrl: './articleview.component.html',
    styleUrls: ['./articleview.component.scss']
})
export class ArticleviewComponent implements OnInit {

    @ViewChild('cropper') cropperComponet: CropperComponent;
    public itemsCategories: Array<string> = ['Top story', 'News', 'Mark your Agenda', 'Arts Contest', 'Schools Celebrating',
        'Essential Reading'];
    currentSize = 'Defalut';

    tags = [];
    croppper = { height: 250, width: 400, image: null };
    sizeChange = true;
    categories;
    newInfo = new CreateNewInfoDto();
    valForm: FormGroup;
    constructor(fb: FormBuilder, private newProxy: NewInfoServiceProxy, private _router: Router) {
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

    }
    setSize(width: number, height: number, size: string) {
        this.croppper.image = this.cropperComponet.image;

        this.sizeChange = false;
        this.croppper.width = width;
        this.croppper.height = height;
        this.currentSize = size;
        setTimeout(() => {
            this.sizeChange = true;
        }, 1000);
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
                    tagArr.push(d.value);
                });
                this.newInfo.tags = tagArr.join();

            }
            this.newInfo.type = this.categories.join();
            this.newInfo.status = 1;
            this.newInfo.thumbnail = this.cropperComponet.getBase64Image();
            this.newProxy.create(this.newInfo).subscribe(d => {
                abp.notify.success('Create Article Success');
                setTimeout(() => {
                    this._router.navigate(['/blog/articles']);
                }, 1000);

            });
        }
    }

}
