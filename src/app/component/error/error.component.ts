import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-error',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.css']
})
export class ErrorComponent implements OnInit {
  msg = '请求出错';

  constructor(private activatedRoute: ActivatedRoute) {
  }

  ngOnInit() {
  }

}
