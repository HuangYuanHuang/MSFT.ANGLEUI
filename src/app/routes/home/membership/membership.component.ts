import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-membership',
  templateUrl: './membership.component.html',
  styleUrls: ['./membership.component.css']
})
export class MembershipComponent implements OnInit {
  words: Array<any>;

  constructor() { }

  ngOnInit() {
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

}
