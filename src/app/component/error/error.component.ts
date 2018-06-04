import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-error',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.css']
})
export class ErrorComponent implements OnInit {
  msg = '非法访问';

  constructor(private activatedRoute: ActivatedRoute) {
  }

  ngOnInit() {
    const msg = this.activatedRoute.snapshot.paramMap.get('msg');
    if (msg) {
      this.msg = msg;
    }
  }

}
