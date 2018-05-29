import { Component, OnInit } from '@angular/core';

import { LogService } from '../../service/log.service';

@Component({
  selector: 'app-log',
  templateUrl: './log.component.html',
  styleUrls: ['./log.component.css']
})
export class LogComponent implements OnInit {

  constructor(public logService: LogService) {}

  ngOnInit() {
  }

}
