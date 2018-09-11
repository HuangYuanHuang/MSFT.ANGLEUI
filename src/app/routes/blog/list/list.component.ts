import { Component, OnInit } from '@angular/core';
import { NewInfoServiceProxy, NewInfoDto, PagedResultDtoOfNewInfoDto } from '@shared/service-proxies/service-proxies';

@Component({
    selector: 'app-list',
    templateUrl: './list.component.html',
    styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {

    words: Array<any>;
    skipCount = 0;
    maxCount = 20;
    news: NewInfoDto[];
    isLoad = false;
    isLoadFinished = false;
    searchType = '';
    constructor(private newProxy: NewInfoServiceProxy) {

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
        this.reRefresh('');
    }
    getColor() {
        const data = ['bg-primary-light', 'bg-primary', 'bg-success', 'bg-info', 'bg-warning',
            'bg-danger', 'bg-inverse-light', 'bg-green-dark', 'bg-purple', 'bg-yellow-light'];
        let index = parseInt((Math.random() * 10) + '', 0);
        index = (index >= 0 && index <= 9) ? index : 0;
        return data[index];
    }
    onScrollDown() {
        this.skipCount += this.maxCount;
        this.reRefresh(this.searchType, true);
    }
    getImageUrl(item: NewInfoDto) {

        return item.thumbnail || 'assets/img/bg1.jpg';
    }
    reRefresh(type: string, isAppend = false) {
        this.searchType = type;
        if (!isAppend) {
            this.news = [];
        }
        this.isLoad = false;
        this.skipCount = 0;
        this.maxCount = 20;
        this.newProxy.getAll(type, -1, 2, this.skipCount, this.maxCount)
            .subscribe((result: PagedResultDtoOfNewInfoDto) => {
                if (isAppend) {
                    result.items.forEach(d => this.news.push(d));
                } else {
                    this.news = result.items;
                    this.news.forEach(g => g.context = this.getColor());
                }
                this.isLoad = true;
                if ((this.skipCount + this.maxCount) >= result.totalCount) {
                    this.isLoadFinished = true;
                } else {
                    this.isLoadFinished = false;
                }
            });
    }
}
