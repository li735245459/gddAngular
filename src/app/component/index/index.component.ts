import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css']
})
export class IndexComponent implements OnInit {
  hotPets = [1, 2, 3, 4];
  hotTerms = [1, 2, 3, 4];
  banners = [1, 2, 3];

  constructor() {
  }

  ngOnInit() {
  }

}
