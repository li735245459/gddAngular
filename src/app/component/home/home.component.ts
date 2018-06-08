import {Component, OnInit} from '@angular/core';

import {UserService} from '../../service/user.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  msg = '正在加载...';

  constructor(private userService: UserService) {
  }

  ngOnInit() {
    this.userService.home().subscribe(result => {
      console.log(result);
    });
  }

}
