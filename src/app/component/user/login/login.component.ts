import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';

import {UserService} from '../../../service/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  msg: string; // 全局提示信息
  // 表单
  formSubmitState = true; // true表示激活表单提交按钮,false表示禁用表单提交按钮
  formValidStyle: number; // 0表单校验成功样式, 1表单校验失败样式
  placeholder = { // 表单字段说明
    email: {'title': '邮箱', 'prompt': 'you@example.com'},
    password: {'title': '密码', 'prompt': '字母开头,长度在6~10之间,只能包含字母、数字和下划线'},
  };
  itemForForm: FormGroup;

  constructor(
    private router: Router,
    private userService: UserService,
    private formBuilder: FormBuilder) {
    this.createItemForForm(); // 创建表单对象
  }

  ngOnInit() {
  }

  /**
   * 创建表单对象
   */
  createItemForForm(): void {
    // itemForForm = new FormGroup({
    //   email: new FormControl('lixing_java@163.com', [
    //     Validators.required,
    //     Validators.pattern('^\\w+([-+.]\\w+)*@\\w+([-.]\\w+)*\\.\\w+([-.]\\w+)*$')]),
    //   password: new FormControl('li12345', [
    //     Validators.required,
    //     Validators.pattern('^[a-zA-Z]\\w{5,9}$')])
    // });
    this.itemForForm = this.formBuilder.group({
      email: ['lixing_java@163.com', [
        Validators.required,
        Validators.pattern('^\\w+([-+.]\\w+)*@\\w+([-.]\\w+)*\\.\\w+([-.]\\w+)*$')]],
      password: ['li12345', [
        Validators.required,
        Validators.pattern('^[a-zA-Z]\\w{5,9}$')
      ]]
    });
  }

  /**
   * 提交登录表单
   * @param userForm
   */
  onSubmitForm(userForm): void {
    /**
     * 登陆表单校验成功
     */
    if (userForm.valid) {
      this.formSubmitState = false; // 禁用表单提交按钮
      this.formValidStyle = 0; // 表单校验成功样式
      this.msg = '表单校验成功';
      this.userService.login(userForm.value).subscribe((responseJson) => {
        if (responseJson.code === 0) { // 登陆成功
          this.formSubmitState = false; // 禁用表单提交按钮
          this.formValidStyle = 0; // 表单校验成功样式
          this.msg = '登陆成功';
          sessionStorage.removeItem('jwt');
          sessionStorage.setItem('jwt', responseJson.data.jwt); // 本地存储jwt,随浏览器窗口共存亡
          setTimeout(() => {
            this.router.navigateByUrl('/admin');
          }, 1000);
        } else { // 登陆失败
          this.formSubmitState = true; // 激活表单提交按钮
          this.formValidStyle = 1; // 表单校验失败样式
          this.msg = responseJson.msg;
        }
      });
    } else {
      this.formSubmitState = true; // 激活表单提交按钮
      this.formValidStyle = 1; // 表单校验失败
      this.msg = '表单校验失败';
    }
  }

}
