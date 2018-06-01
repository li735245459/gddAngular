import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-error',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.css']
})
export class ErrorComponent implements OnInit {
  msg = '系统错误';

  constructor(private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    this.msg = this.activatedRoute.snapshot.paramMap.get('msg');
  }

}
