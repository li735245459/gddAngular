import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {FormControl, FormGroup, Validators} from '@angular/forms';

import { User } from '../../../model/user';

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
    password: 'li123456'
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
    private router: Router) { }

  ngOnInit() {
  }

  onSubmit(userForm): void {
    if (userForm.valid) {
      console.log(JSON.stringify(this.user));
      if (userForm.value.email === 'lixing_java@163.com' && userForm.value.password === 'li123456') {
        this.canSubmit = false;
        this.messages = '登录成功';
        setTimeout(() => this.router.navigateByUrl('heroes'), 1000);
      } else {
        this.canSubmit = true;
        this.messages = '登录失败(邮箱或者密码错误)';
      }
    } else {
      this.canSubmit = true;
      this.messages = '表单校验失败';
    }
  }

}
