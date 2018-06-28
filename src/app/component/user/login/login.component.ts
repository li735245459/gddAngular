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
  itemForForm: FormGroup;
  formSubmitState = false; // true禁止表单提交,默认false
  formValidStyle; // 0表单校验成功样式, 1表单校验失败样式
  placeholder = { // 表单字段说明
    email: {'title': '邮箱', 'prompt': 'you@example.com'},
    password: {'title': '密码', 'prompt': '字母开头,长度在6~10之间,只能包含字母、数字和下划线'},
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
   * 创建表单对象
   */
  createItemForForm(): void {
    // itemForForm = new FormGroup({
    //   email: new FormControl('', [
    //     Validators.required,
    //     Validators.pattern('^\\w+([-+.]\\w+)*@\\w+([-.]\\w+)*\\.\\w+([-.]\\w+)*$')]),
    //   password: new FormControl('', [
    //     Validators.required,
    //     Validators.pattern('^[a-zA-Z]\\w{5,9}$')])
    // });
    this.itemForForm = this.formBuilder.group({
      email: [null, [
        Validators.required,
        Validators.pattern('^\\w+([-+.]\\w+)*@\\w+([-.]\\w+)*\\.\\w+([-.]\\w+)*$')]],
      password: [null, [
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
    this.userService.login(userForm.value).subscribe((responseJson) => {
      if (responseJson.code === 0) {
        this.formSubmitState = true; // 禁用表单提交
        this.formValidStyle = 0; // 设置全局消息样式为成功
        this.msg = '登陆成功';
        sessionStorage.removeItem('jwt');
        sessionStorage.setItem('jwt', responseJson.data.jwt); // 本地存储jwt,随浏览器窗口共存亡
        setTimeout(() => {this.router.navigateByUrl('/admin');}, 1000);
      } else {
        this.formSubmitState = false; // 激活表单提交
        this.formValidStyle = 1; // 设置全局消息样式为失败
        this.msg = responseJson.msg;
      }
    });
  }
}
