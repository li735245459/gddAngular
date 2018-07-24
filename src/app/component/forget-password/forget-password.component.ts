import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {interval} from 'rxjs';

import {UserService} from '../../service/user.service';
import {SendEmail} from '../../globalEnums/send-email.enum';

@Component({
  selector: 'app-forget-password',
  templateUrl: './forget-password.component.html',
  styleUrls: ['./forget-password.component.css']
})
export class ForgetPasswordComponent implements OnInit {
  msg: string; // 全局提示信息
  second = 30; // 倒计时等待时间,单位秒
  waitSeconds = 0;
  // 表单
  itemForForm: FormGroup = null; // 表单对象
  formSubmitState = false; // true禁止表单提交,false启用表单提交
  formValidStyle = true; // true表单校验成功样式, false表单校验失败样式
  placeholder = { // 表单字段说明
    email: {'title': '邮箱', 'prompt': 'you@example.com'},
    code: {'title': '验证码', 'prompt': '8888'},
  };

  constructor(
    private router: Router,
    private userService: UserService,
    private formBuilder: FormBuilder) {
    this.createItemForForm(); // 创建表单对象
  }

  ngOnInit() {
  }

  /**
   * 创建表单
   */
  createItemForForm() {
    this.itemForForm = this.formBuilder.group({
      email: [null, [
        Validators.required,
        Validators.pattern('^\\w+([-+.]\\w+)*@\\w+([-.]\\w+)*\\.\\w+([-.]\\w+)*$')]
      ],
      code: [null, [
        Validators.required,
        Validators.pattern('^[A-Za-z0-9]{4}$')]]
    });
  }

  /**
   * 获取验证码
   * @param codeText
   */
  onGetEmailCode(receiver): void {
    // interval创建Observable可观察对象的函数
    // 1000毫秒执行一次
    const secondsCounter = interval(1000).subscribe(n => {
      this.waitSeconds = this.second - n;
      if (this.waitSeconds === 0) {
        secondsCounter.unsubscribe();
      }
    });
    this.userService.sendEmail(SendEmail.FORGET_PASSWORD, receiver).subscribe(responseJson => {
      if (responseJson.code === 0) {
        this.formValidStyle = true;
        this.msg = '验证码发送成功,注意查收';
      } else {
        this.formValidStyle = false;
        this.msg = responseJson.msg;
      }
    });
  }

  /**
   *  提交表单
   * @param userForm
   */
  onSubmit(itemForForm): void {
    this.userService.checkEmailCode(SendEmail.FORGET_PASSWORD, itemForForm.value.email, itemForForm.value.code).subscribe(responseJson => {
      if (responseJson.code === 0) {
        this.formSubmitState = true;
        this.formValidStyle = true;
        this.msg = '邮箱、验证码正确';
        sessionStorage.setItem('code', itemForForm.value.code);
        setTimeout(() => {
          this.router.navigateByUrl(`modifyPassword/${itemForForm.value.email}`);
        }, 1000);
      } else {
        this.formSubmitState = false;
        this.formValidStyle = false;
        this.msg = responseJson.msg;
      }
    });
  }

}
