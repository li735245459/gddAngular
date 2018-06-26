import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {FormControl, FormGroup, Validators} from '@angular/forms';

import {User} from '../../../model/user';
import {UserService} from '../../../service/user.service';
import {china} from '../../../data/china';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  canSubmit = true; // true表示激活表单提交按钮,false表示禁用表单提交按钮
  checkCode: number; // 0表示校验成功, 1表示校验失败
  msg: string; // 全局提示信息
  provinceList: any; // 省级数据
  cityList: any; // 级联市级数据
  areaList: any; // 级联区级数据
  user: User = { // User模型
    id: '',
    name: '李星',
    phone: '17502503714',
    email: 'lixing_java@163.com',
    password: 'li12345',
    rePassword: 'li12345',
    sex: 'male',
    hobby: [],
    province: '0',
    city: '0',
    area: '0',
    address: '谷里街道泉塘公寓12栋403',
    introduce: '',
  };
  userForm = new FormGroup({ // User表单
    name: new FormControl('', [
      Validators.required,
      Validators.pattern('^[\u4e00-\u9fa5]{2,5}$')]),
    phone: new FormControl('', [
      Validators.required,
      Validators.pattern('^(13[0-9]|14[5|7]|15[0|1|2|3|5|6|7|8|9]|18[0|1|2|3|5|6|7|8|9]|17[0|1|2|3|5|6|7|8|9])\\d{8}$')]),
    email: new FormControl('', [
      Validators.required,
      Validators.pattern('^\\w+([-+.]\\w+)*@\\w+([-.]\\w+)*\\.\\w+([-.]\\w+)*$')]),
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
  placeholder = { // User模型字段说明
    name: {'title': '姓名', 'prompt': '(2~4位汉子)'},
    phone: {'title': '手机号码', 'prompt': '(11位数字)'},
    email: {'title': '邮箱', 'prompt': '(you@example.com)'},
    password: {'title': '密码', 'prompt': '(字母开头的6~10位字母、数字和下划线)'},
    rePassword: {'title': '重复密码', 'prompt': ''},
    address: {'title': '详细地址', 'prompt': '(10~20位字符)'},
    introduce: {'title': '自我介绍', 'prompt': ''}
  };

  constructor(
    private router: Router,
    private userService: UserService) {
  }

  ngOnInit() {
    this.provinceList = china; // 初始化: 加载省级数据
  }

  /**
   * 选择爱好
   *  选择时会将其id添加到hobby数组中
   *  提交注册时会将hobby数组转化成hobby字符串
   *  注册失败则在回调函数中将hobby字符串重新转换成hobby数组
   * @param hobby
   */
  onChangeHobby(hobby): void {
    const index = this.user.hobby.indexOf(hobby);
    if (index === -1) {
      this.user.hobby.push(hobby);
    } else {
      this.user.hobby.splice(index, 1);
    }
  }

  /**
   * 选择省: 设置当前省级数据并级联出其市级数据
   * @param province
   */
  onChangeProvince(selectedOption): void {
    this.user.province = selectedOption.value; // 设置省级数据
    this.user.city = '0';
    this.cityList = '';
    this.areaList = '';
    this.cityList = this.provinceList[selectedOption.selectedIndex - 1].cityList; // 级联市级数据
  }

  /**
   * 选择市: 设置当前市级数据并级联出其区级数据
   * @param selectedOption
   */
  onChangeCity(selectedOption): void {
    this.user.city = selectedOption.value; // 设置市级数据
    this.user.area = '0';
    this.areaList = '';
    this.areaList = this.cityList[selectedOption.selectedIndex - 1].areaList; // 级联区级数据
  }

  /**
   * 选择区: 设置当前区级数据
   * @param selectedOption
   */
  onChangeArea(selectedOption): void {
    this.user.area = selectedOption.value; // 设置区级数据
  }

  /**
   * 提交注册表单
   * @param userForm
   */
  onSubmit(userForm): void {
    /**
     * 注册表单校验成功
     */
    if (userForm.valid && this.user.province !== '0' && this.user.city !== '0' &&
      ((this.areaList === '' && this.user.area === '0') || (this.areaList !== '' && this.user.area !== '0'))) {
      if (userForm.value.password === userForm.value.rePassword) {
        /**
         * 密码一致
         */
        this.canSubmit = false;
        this.checkCode = 0;
        this.msg = '表单校验成功';
        userForm.value.hobby = this.user.hobby;
        this.userService.register(userForm.value).subscribe((responseJson) => {
            /**
             * 注册成功
             */
            if (responseJson.code === 0) {
              this.checkCode = 0;
              this.msg = '注册成功';
              setTimeout(() => this.router.navigateByUrl('/login'), 1000);
            } else if (responseJson.code === 13) {
              this.canSubmit = true;
              this.checkCode = 1;
              this.msg = '邮箱已被注册';
              if (typeof this.user.hobby === 'string') {
                this.user.hobby = this.user.hobby.split(','); // 将hobby字符串转化成hobby数组
              }
            } else {
              /**
               * 注册失败
               */
              this.canSubmit = true;
              this.checkCode = 1;
              this.msg = responseJson.msg;
            }
          }
        );
      } else {
        /**
         * 密码不一致
         */
        this.checkCode = 1;
        this.msg = '密码不一致';
      }
    } else {
      /**
       * 注册表单校验失败
       */
      this.checkCode = 1;
      this.msg = '表单校验失败';
    }
  }
}

