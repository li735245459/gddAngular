import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {FormControl, FormGroup, Validators} from '@angular/forms';

import {User} from '../../../model/user';
import {UserService} from '../../../service/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  // 表单校验成功后提交到数据库校验结果信息
  messages: string;
  // true表示激活表单提交按钮,false表示禁用表单提交按钮
  canSubmit = true;
  // User模型
  user: User = {
    email: 'lixing_java@163.com',
    password: ''
  };
  // User模型字段说明
  userFormPlaceholder = {
    email: {'title': '邮箱', 'prompt': 'you@example.com'},
    password: {'title': '密码', 'prompt': '字母开头,长度在6~10之间,只能包含字母、数字和下划线'},
  };
  // User表单
  userForm = new FormGroup({
    email: new FormControl('', [
      Validators.required,
      Validators.pattern('^\\w+([-+.]\\w+)*@\\w+([-.]\\w+)*\\.\\w+([-.]\\w+)*$')] ),
    password: new FormControl('', [
      Validators.required,
      Validators.pattern('^[a-zA-Z]\\w{5,9}$')])
  });

  constructor(
    private router: Router,
    private userService: UserService) { }

  ngOnInit() {
  }

  /**
   * 提交登录表单
   * @param userForm
   */
  onSubmit(userForm): void {
    if (userForm.valid) {
      this.userService.login(userForm.value).subscribe((result: any) => {
        this.messages = result.message;
        if (result.code === 1) {
          this.canSubmit = false;
          setTimeout(() => this.router.navigateByUrl('heroes'), 1000);
        }
      });
    } else {
      this.messages = '表单校验失败';
    }
  }

}
