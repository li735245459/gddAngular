import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';

import {User} from '../../../model/user';

@Component({
  selector: 'app-modify-password',
  templateUrl: './modify-password.component.html',
  styleUrls: ['./modify-password.component.css']
})
export class ModifyPasswordComponent implements OnInit {
  // 表单校验成功后提交到数据库校验结果信息
  message: string;
  // true表示激活表单提交按钮,false表示禁用表单提交按钮
  canSubmit = true;
  // User模型
  user: User = {};
  // User模型字段说明
  userFormPlaceholder = {
    password: {'title': '新密码', 'prompt': '字母开头,长度在6~10之间,只能包含字母、数字和下划线'},
    rePassword: {'title': '重复新密码', 'prompt': '字母开头,长度在6~10之间,只能包含字母、数字和下划线'},
  };
  // User表单
  userForm = new FormGroup({
    password: new FormControl('', [
      Validators.required,
      Validators.pattern('^[a-zA-Z]\\w{5,9}$')] ),
    rePassword: new FormControl('', [
      Validators.required,
      Validators.pattern('^[a-zA-Z]\\w{5,9}$')])
  });

  constructor(
    private router: Router) { }

  ngOnInit() {
  }

  onSubmit(userForm): void {
    if (userForm.valid) {
      if (this.user.password === this.user.rePassword) {
          if (this.user.password === 'li12345') {
            this.message = '修改成功';
            this.canSubmit = false;
            setTimeout(() => this.router.navigateByUrl('heroes'), 1000);
          } else {
            this.message = '修改失败';
            this.canSubmit = true;
          }
      } else {
        this.message = '两次输入的密码不一致';
        this.canSubmit = true;
      }
    } else {
      this.message = '表单验证失败';
      this.canSubmit = true;
    }
  }

}
