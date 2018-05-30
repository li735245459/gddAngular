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
  // 表单校验成功后提交到数据库校验结果信息
  message: string;
  // true表示激活表单提交按钮,false表示禁用表单提交按钮
  canSubmit = true;
  // true表示激活发送验证码按钮,false表示禁用发送验证码按钮
  canGetCode = true;
  // 倒计时
  seconds = 0;
  // User模型
  user: User = {
    email: 'lixing_java@163.com',
    codeText: '8888'
  };
  // User模型字段说明
  userFormPlaceholder = {
    email: {'title': '邮箱', 'prompt': 'you@example.com'},
    codeText: {'title': '验证码', 'prompt': '8888'},
  };
  // User表单
  userForm = new FormGroup({
    email: new FormControl('', [
      Validators.required,
      Validators.pattern('^\\w+([-+.]\\w+)*@\\w+([-.]\\w+)*\\.\\w+([-.]\\w+)*$')] ),
    codeText: new FormControl('', [
      Validators.required,
      Validators.pattern('^[A-Za-z0-9]{4}$')])
  });

  constructor(
    private router: Router,
    private userService: UserService) { }

  ngOnInit() {
  }

  /**
   * 获取验证码
   * @param codeText
   */
  onGetCodeText(email): void {
    this.canGetCode = false;
    const secondsCounter = interval(1000).subscribe(n => {
      this.seconds = 10 - n;
      if (this.seconds === 1) {
        this.canGetCode = true;
        this.seconds = 0;
        secondsCounter.unsubscribe();
      }
    });
    console.log(email);
    this.userService.sendEmail(email, 'forgetPassword').subscribe(result => {
      console.log(result);
    });
  }

  /**
   *  提交表单
   * @param userForm
   */
  onSubmit(userForm): void {
    if (userForm.valid) {
      this.user.codeType = 'forgetPassword';
      console.log(this.user);
      if (this.user.email === 'lixing_java@163.com' && this.user.codeText === '8888') {
        this.canSubmit = true;
        this.message = '验证码正确';
        setTimeout(() => this.router.navigateByUrl('modifyPassword' + '?email=' + this.user.email), 500);
      } else {
        this.canSubmit = true;
        this.message = '验证码错误';
      }
    } else {
      this.canSubmit = true;
    }
  }

}
