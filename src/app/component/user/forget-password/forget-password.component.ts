import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {interval} from 'rxjs';

import {User} from '../../../model/user';
import {UserService} from '../../../service/user.service';

@Component({
  selector: 'app-forget-password',
  templateUrl: './forget-password.component.html',
  styleUrls: ['./forget-password.component.css']
})
export class ForgetPasswordComponent implements OnInit {
  canSubmit = true; // true表示激活表单提交按钮,false表示禁用表单提交按钮
  checkCode: number; // 0表示成功,1表示失败
  msg: string; // 全局提示信息
  second = 30; // 倒计时等待时间,单位秒
  waitSeconds = 0;
  user: User = { // User模型
    email: 'lixing_java@163.com',
    code: ''
  };
  userForm = new FormGroup({ // User表单
    email: new FormControl('', [
      Validators.required,
      Validators.pattern('^\\w+([-+.]\\w+)*@\\w+([-.]\\w+)*\\.\\w+([-.]\\w+)*$')]),
    code: new FormControl('', [
      Validators.required,
      Validators.pattern('^[A-Za-z0-9]{4}$')])
  });
  placeholder = { // User模型字段说明
    email: {'title': '邮箱', 'prompt': 'you@example.com'},
    code: {'title': '验证码', 'prompt': '8888'},
  };

  constructor(
    private router: Router,
    private userService: UserService) {
  }

  ngOnInit() {
  }

  /**
   * 获取验证码
   * @param codeText
   */
  onGetEmailCode(receiver): void {
    const secondsCounter = interval(1000).subscribe(n => {
      this.waitSeconds = this.second - n;
      if (this.waitSeconds === 0) {
        secondsCounter.unsubscribe();
      }
    });
    this.userService.sendEmail('1', receiver).subscribe(responseJson => {
      if (responseJson.code === 0) {
        this.checkCode = 0;
        this.msg = '验证码发送成功,注意查收';
      } else {
        this.checkCode = 1;
        this.msg = responseJson.msg;
      }
    });
  }

  /**
   *  提交表单
   * @param userForm
   */
  onSubmit(userForm): void {
    if (userForm.valid) {
      this.canSubmit = false;
      this.checkCode = 0;
      this.msg = '表单校验成功';
      this.userService.checkEmailCode('1', userForm.value.email, userForm.value.code).subscribe(responseJson => {
        if (responseJson.code === 0) {
          this.canSubmit = false;
          this.checkCode = 0;
          this.msg = '邮箱、验证码正确';
          setTimeout(() => {
            this.router.navigateByUrl(`modifyPassword/${userForm.value.email}`);
          }, 500);
        } else {
          this.canSubmit = true;
          this.checkCode = 1;
          this.msg = responseJson.msg;
        }
      });
    } else {
      this.checkCode = 1;
      this.msg = '表单校验失败';
    }
  }

}
