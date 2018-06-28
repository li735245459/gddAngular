import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';

import {UserService} from '../../../service/user.service';
import {hobby, province} from '../../../data/UserData';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  msg: string = null; // 全局提示信息
  // 表单
  itemForForm: FormGroup = null; // 表单对象
  formSubmitState = false; // true禁止表单提交,默认false
  formValidStyle = 0; // 0表单校验成功样式, 1表单校验失败样式
  /*
    hobby类型为checkbox:
      初始化加载数据为本地数组对象-[{'id':'1','name':'篮球'},{'id':'2','name':'足球'}]
      用户选择后存取数据库的值为id字符串--'1,2'
    添加数据时,创建表单对象时该属性值为[]
    编辑数据时,创建表单对象时该属性值为--'1,2'.split(',')) => [1,2]
    当用户点击复选框时触发change回调函数对表单对象hobby属性值进行动态修改
    当用户提交表单时将表单对象hobby属性值转化成字符串--[1,2].join(',') => '1,2'
   */
  hobby = hobby;
  /*
    省、市、区类型为级联下拉列表:
      初始化加载数据为本地对象
      用户选择后存取数据库的值为下拉列表的值
   */
  levelOne: any = null; // 一级数据
  levelTwo: any = null; // 二级数据
  levelThree: any = null; // 二级数据
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
    this.levelOne = province;
    this.itemForForm = this.formBuilder.group({
      'name': [null, [
        Validators.required,
        Validators.pattern('^[\u4e00-\u9fa5]{2,5}$')]],
      'email': [null, [
        Validators.required,
        Validators.pattern('^\\w+([-+.]\\w+)*@\\w+([-.]\\w+)*\\.\\w+([-.]\\w+)*$')]],
      'phone': [null, [
        Validators.required,
        Validators.pattern('^(13[0-9]|14[5|7]|15[0|1|2|3|5|6|7|8|9]|18[0|1|2|3|5|6|7|8|9]|17[0|1|2|3|5|6|7|8|9])\\d{8}$')]],
      'password': [null, [
        Validators.required,
        Validators.pattern('^[a-zA-Z]\\w{5,9}$')
      ]],
      'rePassword': [null, [
        Validators.required,
        Validators.pattern('^[a-zA-Z]\\w{5,9}$')
      ]],
      'address': [null, [
        Validators.required,
        Validators.pattern('^.{10,20}$')
      ]],
      'introduce': [null, Validators.pattern('^.{0,50}$')],
      'sex': [null, Validators.pattern('^["male"|"female"].*$')],
      'hobby': [[]],
      'province': ['0', Validators.pattern('^[^"0"].*$')]
    });
    /*动态加载表单对象的checkbox属性对象*/
    for (let i = 0; i < this.hobby.length; i++) {
      const hobbyId = this.hobby[i].id;
      const hobbyName = `hobby${hobbyId}`;
      this.itemForForm.addControl(hobbyName, new FormControl(null));
    }
  }

  /**
   * 复选框点击事件
   * @param event
   */
  onChangeHobby(checkbox) {
    const index = this.itemForForm.value.hobby.indexOf(checkbox.value);
    if (index === -1) {
      this.itemForForm.value.hobby.push(checkbox.value);
    } else {
      this.itemForForm.value.hobby.splice(index, 1);
    }
    // console.log(this.itemForForm.value.hobby);
  }

  /**
   * 一级下拉列表change事件
   *  值为'0',置空所有级联下拉列表数据以及表单相关属性对象
   *  值不为'0',设置二级联下拉列表数据以及表单相关属性对象
   * @param selectedOption
   */
  onChangeLevelOne(selectedOption): void {
    this.itemForForm.patchValue({'province': selectedOption.value}); // 设置表单对象province属性值为当前选中下拉列表值
    if (selectedOption.value !== '0' && this.levelOne[selectedOption.selectedIndex - 1].child) {
      this.itemForForm.addControl('city', new FormControl('0', Validators.pattern('^[^"0"].*$'))); // 添加表单对象的city属性对象
      this.levelTwo = this.levelOne[selectedOption.selectedIndex - 1].child; // 初始化levelTwo
    } else {
      this.itemForForm.removeControl('city'); // 移除表单对象的city属性对象
      this.levelTwo = undefined; // 屏蔽二级下拉列表
    }
    this.itemForForm.removeControl('area'); // 移除表单对象的area属性对象
    this.levelThree = undefined; // 屏蔽三级下拉列表
  }

  /**
   * 二级下拉列表change事件
   *  值为'0',置空所有级联下拉列表数据以及表单相关属性对象
   *  值不为'0',设置三级下拉列表数据以及表单相关属性对象
   * @param selectedOption
   */
  onChangeLevelTwo(selectedOption): void {
    this.itemForForm.patchValue({'city': selectedOption.value});
    if (selectedOption.value !== '0' && this.levelTwo[selectedOption.selectedIndex - 1].child) {
      this.itemForForm.addControl('area', new FormControl('0', Validators.pattern('^[^"0"].*$')));
      this.levelThree = this.levelTwo[selectedOption.selectedIndex - 1].child;
    } else {
      this.itemForForm.removeControl('area');
      this.levelThree = undefined;
    }
  }

  /**
   * 三级下拉列表change事件
   * @param selectedOption
   */
  onChangeLevelThree(selectedOption): void {
    this.itemForForm.patchValue({'area': selectedOption.value});
  }

  /**
   * 提交注册表单
   * @param userForm
   */
  onSubmit(itemForForm): void {
    if (itemForForm.value.password === itemForForm.value.rePassword) {
      // this.formSubmitState = true;
      // this.formValidStyle = 0;
      // this.msg = '表单校验成功';
      this.userService.register(itemForForm.value).subscribe((responseJson) => {
          if (responseJson.code === 0) {
            // 操作成功
            this.formSubmitState = true;
            this.formValidStyle = 0;
            this.msg = '注册成功';
            setTimeout(() => this.router.navigateByUrl('/login'), 2000);
          } else {
            // 操作失败
            this.formSubmitState = false;
            this.formValidStyle = 1;
            this.msg = responseJson.msg;
          }
        }
      );
    } else {
      this.msg = '密码不一致';
      this.formValidStyle = 1;
      this.formSubmitState = false;
    }
  }
}

