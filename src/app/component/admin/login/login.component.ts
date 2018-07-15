import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';

import {UserService} from '../../../service/user.service';
import {Md5} from 'ts-md5';

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
  formValidStyle = true; // true表单校验成功样式, false表单校验失败样式
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
    this.itemForForm = this.formBuilder.group({
      email: ['lixing_java@163.com', [
        Validators.required,
        Validators.pattern('^\\w+([-+.]\\w+)*@\\w+([-.]\\w+)*\\.\\w+([-.]\\w+)*$')]],
      password: ['gdd1234', [
        Validators.required,
        Validators.pattern('^[a-zA-Z]\\w{5,9}$')
      ]]
    });
  }

  /**
   * 提交登录表单
   * @param userForm
   */
  onSubmitForm(itemForForm): void {
    // 对密码进行加密
    itemForForm.value.password = Md5.hashStr(itemForForm.value.password).toString();
    this.userService.login(itemForForm.value).subscribe((responseJson) => {
      if (responseJson.code === 0) {
        this.formSubmitState = true; // 禁用表单提交
        this.formValidStyle = true; // 设置全局消息样式为成功
        this.msg = '登陆成功';
        sessionStorage.clear();
        sessionStorage.setItem('jwt', responseJson.data.jwt);
        sessionStorage.setItem('name', responseJson.data.name);
        sessionStorage.setItem('cover', responseJson.data.cover);
        setTimeout(() => {
          this.router.navigateByUrl('/admin');
        }, 1000);
      } else {
        this.formSubmitState = false; // 激活表单提交
        this.formValidStyle = false; // 设置全局消息样式为失败
        this.msg = responseJson.msg;
      }
    });
  }
}
