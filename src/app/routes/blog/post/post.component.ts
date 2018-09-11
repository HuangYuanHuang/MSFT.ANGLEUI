import { Component, OnInit } from '@angular/core';
import { NewInfoServiceProxy, NewInfoDto } from '@shared/service-proxies/service-proxies';
import { DomSanitizer } from '@angular/platform-browser';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';

@Component({
    selector: 'app-post',
    templateUrl: './post.component.html',
    styleUrls: ['./post.component.scss']
})
export class PostComponent implements OnInit {
    defaultId = '5cb1ce9f-a74b-427f-88ff-451e38ea24f5';
    words: Array<any>;
    catcha: any;
    //   tags: string[];
    newInfo: NewInfoDto;
    constructor(private route: ActivatedRoute, private newsProxy: NewInfoServiceProxy,
        private sanitizer: DomSanitizer) {
        this.words = [
            {
                text: 'Lorem',
                weight: 13
                // link: 'http://themicon.co'
            }, {
                text: 'Ipsum',
                weight: 10.5
            }, {
                text: 'Dolor',
                weight: 9.4
            }, {
                text: 'Sit',
                weight: 8
            }, {
                text: 'Amet',
                weight: 6.2
            }, {
                text: 'Consectetur',
                weight: 5
            }, {
                text: 'Adipiscing',
                weight: 5
            }, {
                text: 'Sit',
                weight: 8
            }, {
                text: 'Amet',
                weight: 6.2
            }, {
                text: 'Consectetur',
                weight: 5
            }, {
                text: 'Adipiscing',
                weight: 5
            }
        ];
    }

    ngOnInit() {
        const id = this.route.snapshot.params['id'] || this.defaultId;
        this.newsProxy.get(id).subscribe(res => {
            this.newInfo = res;
            // this.tags = res.tags.split(',');
            this.catcha = this.sanitizer.bypassSecurityTrustHtml(res.context);
        });
    }

}
