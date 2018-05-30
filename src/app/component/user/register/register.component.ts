import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {FormControl, FormGroup, Validators} from '@angular/forms';

import {User} from '../../../model/user';
import {UserService} from '../../../service/user.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  // 表单校验成功后提交到数据库校验结果信息
  message: string;
  // true表示激活表单提交按钮,false表示禁用表单提交按钮
  canSubmit = true;
  // User模型
  user: User = {
    id: '',
    name: '李星',
    phone: '17502503714',
    email: 'lixing_java@163.com',
    password: '',
    rePassword: '',
    sex: 'male',
    hobby: [],
    province: '1',
    city: '1',
    area: '1',
    address: '谷里街道泉塘公寓12栋403',
    introduce: '',
  };
  // User模型字段说明
  formPlaceholder = {
    name: {'title': '姓名', 'prompt': '(2~4位汉子)'},
    phone: {'title': '手机号码', 'prompt': '(11位数字)'},
    email: {'title': '邮箱', 'prompt': '(you@example.com)'},
    password: {'title': '密码', 'prompt': '(字母开头的6~10位字母、数字和下划线)'},
    rePassword: {'title': '重复密码', 'prompt': ''},
    address: {'title': '详细地址', 'prompt': '(10~20位字符)'},
    introduce: {'title': '自我介绍', 'prompt': ''}
  };
  // User表单
  userForm = new FormGroup({
    name: new FormControl('', [
      Validators.required,
      Validators.pattern('^[\u4e00-\u9fa5]{2,5}$')] ),
    phone: new FormControl('', [
      Validators.required,
      Validators.pattern('^(13[0-9]|14[5|7]|15[0|1|2|3|5|6|7|8|9]|18[0|1|2|3|5|6|7|8|9]|17[0|1|2|3|5|6|7|8|9])\\d{8}$')] ),
    email: new FormControl('', [
      Validators.required,
      Validators.pattern('^\\w+([-+.]\\w+)*@\\w+([-.]\\w+)*\\.\\w+([-.]\\w+)*$')] ),
    password: new FormControl('', [
      Validators.required,
      Validators.pattern('^[a-zA-Z]\\w{5,9}$')]),
    rePassword: new FormControl('', [
      Validators.required,
      Validators.pattern('^[a-zA-Z]\\w{5,9}$')]),
    address: new FormControl('', [
      Validators.required,
      Validators.pattern('^.{10,20}$')]),
    introduce: new FormControl('', [Validators.pattern('^.{0,}$')]),
    sex: new FormControl(),
    hobby: new FormControl(),
    province: new FormControl(),
    city: new FormControl(),
    area: new FormControl()
  });

  constructor(
    private router: Router,
    private userService: UserService) { }

  ngOnInit() {
  }

  /**
   * 选择兴趣爱好
   * @param hobby
   */
  onCheckHobby(hobby): void {
    const index = this.user.hobby.indexOf(hobby);
    if (index === -1) {
      this.user.hobby.push(hobby);
    } else {
      this.user.hobby.splice(index, 1);
    }
  }

  /**
   * 提交注册表单
   * @param userForm
   */
  onSubmit(userForm): void {
    if (userForm.valid) {
      if (userForm.value.password === userForm.value.rePassword) {
        this.canSubmit = false;
        userForm.value.hobby = this.user.hobby;
        console.log(userForm.value.password);
        console.log(userForm.value.rePassword);
        console.log(this.user.password);
        console.log(this.user.rePassword);
        this.userService.register(userForm.value).subscribe((result: any) => {
            this.message = result.content;
            if (result.code === 1) {
              // 注册成功
              this.canSubmit = false;
              setTimeout(() => this.router.navigateByUrl('/login'), 1000);
            } else if (result.code === 0) {
              // 注册失败
              this.canSubmit = true;
            } else if (result.code === -1) {
              // 该邮箱已被注册
              // 将hobby字符串转你成数组
              if (typeof this.user.hobby === 'string') {
                this.user.hobby = this.user.hobby.split(',');
              }
              this.canSubmit = true;
            }
          }
        );
      } else {
        this.message = '密码不一致';
      }
    } else {
      this.message = '表单校验失败';
    }
  }
}

