import {Component, OnInit} from '@angular/core';

import {UserService} from '../../../service/user.service';

@Component({
  selector: 'app-user-info',
  templateUrl: './user-info.component.html',
  styleUrls: ['./user-info.component.css']
})
export class UserInfoComponent implements OnInit {
  msg = '查询成功';
  data = [];
  total = 100;
  // pageSize = 10;
  // pageNumber = 1;
  pageOptions = {
    layout: ['list', 'sep', 'first', 'prev', 'next', 'last', 'sep', 'tpl', 'info']
  };

  constructor(
    private userService: UserService) {
  }

  ngOnInit() {
    this.userService.queryByPage().subscribe(responseJson => {
      if (responseJson.code === 0) {
        this.msg = '查询成功';
        this.data = responseJson.data;
      } else {
        this.msg = '查询失败';
      }
    });
  }

}
