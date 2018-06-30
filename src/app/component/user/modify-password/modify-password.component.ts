import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {ActivatedRoute} from '@angular/router';

import {UserService} from '../../../service/user.service';
import {Md5} from 'ts-md5';

@Component({
  selector: 'app-modify-password',
  templateUrl: './modify-password.component.html',
  styleUrls: ['./modify-password.component.css']
})
export class ModifyPasswordComponent implements OnInit {
  msg: string; // 全局提示信息
  email: string; // 修改密码唯凭证
  // 表单
  itemForForm: FormGroup = null; // 表单对象
  formSubmitState = false; // true禁止表单提交,false启用表单提交
  formValidStyle = true; // true表单校验成功样式, false表单校验失败样式
  placeholder = { // 表单字段说明
    password: {'title': '新密码', 'prompt': '字母开头,长度在6~10之间,只能包含字母、数字和下划线'},
    rePassword: {'title': '重复新密码', 'prompt': '字母开头,长度在6~10之间,只能包含字母、数字和下划线'},
  };

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private userService: UserService,
    private formBuilder: FormBuilder) {
    this.createItemForForm(); // 创建表单对象
  }

  ngOnInit() {
    if (sessionStorage.getItem('code')) {
      this.email = this.activatedRoute.snapshot.paramMap.get('email');
    } else {
      this.router.navigateByUrl('/error');
    }
  }

  /**
   * 创建表单对象
   */
  createItemForForm(): void {
    this.itemForForm = this.formBuilder.group({
      password: [null, [
        Validators.required,
        Validators.pattern('^[a-zA-Z]\\w{5,9}$')]
      ],
      rePassword: [null, [
        Validators.required,
        Validators.pattern('^[a-zA-Z]\\w{5,9}$')]
      ],
    });
  }

  /**
   * 表单提交
   * @param itemForForm
   */
  onSubmit(itemForForm): void {
    if (this.itemForForm.value.password === this.itemForForm.value.rePassword) {
      itemForForm.value.email = this.email;
      // 密码加密
      itemForForm.value.password = Md5.hashStr(itemForForm.value.password);
      itemForForm.value.rePassword = null;
      this.userService.modifyPassword(itemForForm.value).subscribe(responseJson => {
        if (responseJson.code === 0) {
          this.formSubmitState = true;
          this.formValidStyle = true;
          this.msg = '修改成功';
          setTimeout(() => {
            sessionStorage.removeItem('code');
            this.router.navigateByUrl('/login');
          }, 1000);
        } else {
          this.formSubmitState = false;
          this.formValidStyle = false;
          this.msg = responseJson.msg;
        }
      });
    } else {
      this.formSubmitState = false;
      this.formValidStyle = false;
      this.msg = '密码不一致';
    }
  }

}
