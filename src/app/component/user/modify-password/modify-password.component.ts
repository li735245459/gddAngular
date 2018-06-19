import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {Md5} from 'ts-md5';
import {ActivatedRoute} from '@angular/router';

import {User} from '../../../model/user';
import {UserService} from '../../../service/user.service';

@Component({
  selector: 'app-modify-password',
  templateUrl: './modify-password.component.html',
  styleUrls: ['./modify-password.component.css']
})
export class ModifyPasswordComponent implements OnInit {
  canSubmit = true; // true表示激活表单提交按钮,false表示禁用表单提交按钮
  checkCode: number; // 0表示成功,1表示失败
  msg: string; // 全局提示信息
  email: string; // 修改密码唯凭证
  user: User = {}; // User模型
  userForm = new FormGroup({ // User表单
    password: new FormControl('', [
      Validators.required,
      Validators.pattern('^[a-zA-Z]\\w{5,9}$')]),
    rePassword: new FormControl('', [
      Validators.required,
      Validators.pattern('^[a-zA-Z]\\w{5,9}$')])
  });
  placeholder = { // User模型字段说明
    password: {'title': '新密码', 'prompt': '字母开头,长度在6~10之间,只能包含字母、数字和下划线'},
    rePassword: {'title': '重复新密码', 'prompt': '字母开头,长度在6~10之间,只能包含字母、数字和下划线'},
  };

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private userService: UserService) {
  }

  ngOnInit() {
    this.email = this.activatedRoute.snapshot.paramMap.get('email');
  }

  onSubmit(userForm): void {
    if (userForm.valid) {
      this.canSubmit = false;
      this.checkCode = 0;
      this.msg = '表单校验成功';
      userForm.value.email = this.email; // 设置邮箱作为修改的唯一凭证
      if (this.user.password === this.user.rePassword) {
        userForm.value.password = Md5.hashStr(userForm.value.password);
        userForm.value.rePassword = userForm.value.password;
        this.userService.modifyPassword(userForm.value).subscribe(result => {
          if (result.code === 0) {
            this.canSubmit = false;
            this.checkCode = 0;
            this.msg = '修改成功';
            setTimeout(() => this.router.navigateByUrl('/login'), 1000);
          } else {
            this.canSubmit = true;
            this.checkCode = 1;
            this.msg = result.msg;
          }
        });
      } else {
        this.canSubmit = true;
        this.checkCode = 1;
        this.msg = '两次输入的密码不一致';
      }
    } else {
      this.checkCode = 1;
      this.msg = '表单验证失败';
    }
  }

}
