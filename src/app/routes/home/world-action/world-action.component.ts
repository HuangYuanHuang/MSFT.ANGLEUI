import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-world-action',
  templateUrl: './world-action.component.html',
  styleUrls: ['./world-action.component.css']
})
export class WorldActionComponent implements OnInit {

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
