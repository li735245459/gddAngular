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
  canSubmit = true; // true表示激活表单提交按钮,false表示禁用表单提交按钮
  checkCode: number; // 0表示校验成功, 1表示校验失败
  msg: string; // 全局提示信息
  user: User = { // User模型
    email: 'lixing_java@163.com',
    password: 'li12345'
  };
  formPlaceholder = { // User模型字段说明
    email: {'title': '邮箱', 'prompt': 'you@example.com'},
    password: {'title': '密码', 'prompt': '字母开头,长度在6~10之间,只能包含字母、数字和下划线'},
  };
  userForm = new FormGroup({ // User表单
    email: new FormControl('', [
      Validators.required,
      Validators.pattern('^\\w+([-+.]\\w+)*@\\w+([-.]\\w+)*\\.\\w+([-.]\\w+)*$')]),
    password: new FormControl('', [
      Validators.required,
      Validators.pattern('^[a-zA-Z]\\w{5,9}$')])
  });

  constructor(
    private router: Router,
    private userService: UserService) {
  }

  ngOnInit() {
  }

  /**
   * 提交登录表单
   * @param userForm
   */
  onSubmit(userForm): void {
    /**
     * 登陆表单校验成功
     */
    if (userForm.valid) {
      this.canSubmit = false;
      this.checkCode = 0;
      this.msg = '表单校验成功';
      this.userService.login(userForm.value).subscribe((result) => {
        /**
         *  登陆成功
         */
        if (result.code === 0) {
          this.canSubmit = false;
          this.checkCode = 0;
          this.msg = '登陆成功';
          // localStorage.setItem('token', result.data.token); // 本地存储jwt,永久存在
          sessionStorage.removeItem('jwt');
          sessionStorage.setItem('jwt', result.data.jwt); // 本地存储jwt,随浏览器窗口共存亡
          setTimeout(() => {
            this.router.navigateByUrl('home');
          }, 1000);
        } else {
          /**
           * 登陆失败
           */
          this.canSubmit = true;
          this.checkCode = 1;
          this.msg = result.msg;
        }
      });
    } else {
      /**
       * 登陆表单校验失败
       */
      this.checkCode = 1;
      this.msg = '表单校验失败';
    }
  }

}
