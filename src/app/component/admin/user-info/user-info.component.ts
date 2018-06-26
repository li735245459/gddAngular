import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {UserService} from '../../../service/user.service';
import {User} from '../../../model/user';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';

import {china} from '../../../data/china';

@Component({
  selector: 'app-user-info',
  templateUrl: './user-info.component.html',
  styleUrls: ['./user-info.component.css'],
  encapsulation: ViewEncapsulation.None
})

export class UserInfoComponent implements OnInit {
  msg: string; // 全局提示消息
  // 表格
  title = '用户信息';
  loading = true; // 开启datagrid加载提示
  loadMsg = '正在加载..';
  data = []; // 分页数据
  total = 0; // 所有数据条数
  pageNumber = 1; // 当前分页号
  pageSize = 20; // 默认分页大小
  pageOptions = { // 分页导航条参数设置
    pageList: [20, 30, 40],
    displayMsg: '当前 {from} 到 {to} , 共 {total} 条',
    layout: ['list', 'first', 'prev', 'next', 'last', 'info']
  };
  itemForPage: User = { // 分页参数对象
    sex: ''
  };
  // 添加、编辑弹框
  editDlgTitle; // 添加、编辑弹框标题
  editState = false; // false表示添加数据(默认),true表示编辑数据
  editingRow: User; // 正在编辑数据,默认为undefine
  editDlgState = true; // false弹框打开,true弹框关闭(默认)
  // 删除弹框
  selectedRow; // 当前选中的行(可多选,[{},{}])
  deleteDlgTitle; // 弹框标题
  deleteState = false; // false表示删除选择数据(默认),true表示删除所有数据
  deleteDlgBtnState = false; // 弹框按钮状态,false表示可用(默认),true表示禁用
  deleteDlgState = true; // false弹框打开,true弹框关闭(默认)
  // 表单
  itemForForm: FormGroup; // 表单对象
  formSubmitState = true; // true表示激活表单提交按钮,false表示禁用表单提交按钮
  formValidStyle: number; // 0表单校验成功样式, 1表单校验失败样式
  placeholder = { // 表单字段说明
    name: {'title': '姓名', 'prompt': '(2~4位汉子)'},
    phone: {'title': '手机号码', 'prompt': '(11位数字)'},
    email: {'title': '邮箱', 'prompt': '(you@example.com)'},
    password: {'title': '密码', 'prompt': '(字母开头的6~10位字母、数字和下划线)'},
    rePassword: {'title': '重复密码', 'prompt': ''},
    address: {'title': '详细地址', 'prompt': '(10~20位字符)'},
    introduce: {'title': '自我介绍', 'prompt': ''}
  };
  // hobby复选框
  // hobbys: any;
  hobby1 = false;
  hobby2 = false;
  hobby3 = false;
  // 省、市、区数据级联
  levelOne: any; // 一级数据,默认为undefine
  levelTwo: any; // 二级数据,默认为undefine
  levelThree: any; // 二级数据,默认为undefine

  constructor(
    private userService: UserService,
    private formBuilder: FormBuilder) {
    this.createItemForForm(this.editingRow); // 初始化创建空的表单对象(必须)
  }

  /**
   * 在第一轮 ngOnChanges 完成之后调用,此时所有输入属性都已经有了正确的初始绑定值
   */
  ngOnInit() {
    this.page();
  }

  /**
   * 分页插件触发分页查询: 初始化时会自动触发,不需要在初始化函数中调用page分页方法
   * @param event
   */
  onPageChange(event) {
    console.log('------------onPageChange()');
    console.log(`event.pageNumber--${event.pageNumber}`);
    console.log(`event.pageSize--${event.pageSize}`);
    // this.pageNumber = (event.pageNumber === 0 ? 1 : event.pageNumber);
    // this.pageSize = event.pageSize;
    // this.page();
  }

  /**
   * 查询按钮触发分页查询
   */
  onSearch(): void {
    console.log('------------onSearch()');
    this.page();
  }

  /**
   * 分页查询
   */
  page() {
    console.log('------------page()');
    console.log(this.itemForPage);
    console.log(this.pageNumber);
    console.log(this.pageSize);
    this.userService.page(this.itemForPage, this.pageNumber, this.pageSize).subscribe(responseJson => {
      if (responseJson.code === 0) {
        this.msg = '查询成功';
        // this.data = responseJson.data;
        this.data = responseJson.data.list;
        this.total = responseJson.data.total;
        this.loading = false;
      } else {
        this.msg = '查询失败';
      }
    });
  }

  /**
   * 打开删除弹框
   */
  onOpenDeleteDlg(param): void {
    if (param === 'delete') {
      this.deleteState = false; // 删除所选
      this.deleteDlgTitle = '删除数据';
      if (this.selectedRow) {
        this.msg = '确定要删除所选数据!';
      } else {
        this.deleteDlgBtnState = true; // 禁用删除弹框(确认、取消)按钮
        this.msg = '请先选中需要删除的数据';
      }
    } else {
      this.deleteState = true; // 删除所有
      this.deleteDlgTitle = '清空数据';
      this.msg = '确定要删除所有数据!';
    }
    this.deleteDlgState = false; // 打开删除弹框
  }

  /**
   * 确认删除
   */
  onDeleteSure(): void {
    this.deleteDlgBtnState = true; // 禁用删除弹框按钮
    let id = '';
    if (this.deleteState) { // 删除所有
      id = 'all';
    } else { // 删除所选
      if (this.selectedRow) {
        id = this.selectedRow.map(row => row.id).join(',');
      } else {
        id = '';
        this.deleteDlgState = true; // 关闭删除弹框
      }
    }
    if (id) {
      this.userService.delete(id).subscribe(responseObj => {
        if (responseObj.code === 0) {
          this.deleteDlgBtnState = true;
          this.msg = '删除成功！';
          setTimeout(() => {
            this.page(); // 分页
            this.deleteDlgState = true; // 关闭删除弹框
          }, 2000);
        } else {
          this.msg = '删除失败！';
        }
      });
    }
  }

  /**
   * 取消删除
   */
  onDeleteCancel(): void {
    this.onUnSelect(); // 取消所有选中数据
    this.deleteDlgBtnState = false; // 激活删除弹框(确认、取消)按钮
    this.deleteDlgState = true; // 关闭删除弹框
  }

  /**
   * 取消已选择数据
   */
  onUnSelect(): void {
    this.selectedRow = null;
  }

  /**
   * 打开添加、编辑弹框
   * @param param
   */
  onOpenEditDlg(param): void {
    if (param === 'add') {
      console.log('点击添加按钮进行添加操作');
      this.editState = false;
      this.editDlgTitle = '添加用户信息';
      this.editingRow = undefined;
    } else {
      console.log('双击行进行编辑操作');
      this.editState = true;
      this.editDlgTitle = '编辑用户信息';
      this.editingRow = param;
    }
    this.createItemForForm(this.editingRow); // 重新创建表单对象
    this.editDlgState = false; // 打开添加弹框
  }

  /**
   * 创建表单对象
   */
  createItemForForm(editingRow): void {
    console.log('createItemForForm-------start');
    this.msg = '';
    if (editingRow) {
      console.log('当前操作类型: 编辑用户信息');
      /**
       * 设置hobby复选框选中状态
       */
      if (editingRow.hobby.includes('1')) {
        this.hobby1 = true;
      } else {
        this.hobby1 = false;
      }
      if (editingRow.hobby.includes('2')) {
        this.hobby2 = true;
      } else {
        this.hobby2 = false;
      }
      if (editingRow.hobby.includes('3')) {
        this.hobby3 = true;
      } else {
        this.hobby3 = false;
      }
      /**
       * 解析级联数据
       */
      if (editingRow.province) { // 判断levelOne是否存在
        this.levelOne = china; // 初始化levelOne
        if (editingRow.city) { // 判断levelTwo是否存在
          for (let i = 0; i < this.levelOne.length; i++) {
            if (this.levelOne[i].id === editingRow.province) {
              this.levelTwo = this.levelOne[i].child; // 初始化levelTwo
              if (editingRow.area) { // 判断levelThree是否存在
                for (let j = 0; j < this.levelTwo.length; j++) {
                  if (this.levelTwo[j].id === editingRow.city) {
                    this.levelThree = this.levelTwo[j].child; // 初始化levelThree
                    break;
                  } else {
                    this.levelThree = undefined;
                  }
                }
              } else {
                this.levelThree = undefined;
              }
              break;
            } else {
              this.levelTwo = undefined;
            }
          }
        } else {
          this.levelTwo = undefined;
        }
      } else {
        this.levelOne = undefined;
      }
    } else {
      console.log('当前操作类型: 添加用户信息,需要初始化一些默认值');
      editingRow = new User();
      this.levelOne = china; // 只初始化levelOne,levelTwo和levelThree有用户选择生成
      editingRow.province = '0'; // 设置一级下拉列表默认选中值为'0'
      editingRow.sex = 'male'; // 设置默认sex属性值为male
      editingRow.hobby = '';
    }
    /**
     * 创建表单对象
     * 1、hobby属性值初始化为字符串,创建表单对象时转化成数组,通过change回调函数动态改变该数组内容,提交表单时再转化成字符串
     * 2、添加数据时:点击下拉列表,是否触发其级联下拉列表取决于当前选中的下拉列表的child属性值是否为空
     *   编辑数据时:点击下拉列表,是否触发其级联下拉列表取决于
     *    当前数据中当前下拉列表数据的级联下拉列表数据是否为空和当前选中的下拉列表的child属性值是否为空
     *   级联下拉列表校验规则,值不能为"0"否则校验不通过(默认下拉列表值为"0")
     *    遇到可选的下拉列表时可设置其值为空以避开校验
     */
    this.itemForForm = this.formBuilder.group({
      'name': [editingRow.name, [
        Validators.required,
        Validators.pattern('^[\u4e00-\u9fa5]{2,5}$')]],
      'email': [editingRow.email, [
        Validators.required,
        Validators.pattern('^\\w+([-+.]\\w+)*@\\w+([-.]\\w+)*\\.\\w+([-.]\\w+)*$')]],
      'phone': [editingRow.phone, [
        Validators.required,
        Validators.pattern('^(13[0-9]|14[5|7]|15[0|1|2|3|5|6|7|8|9]|18[0|1|2|3|5|6|7|8|9]|17[0|1|2|3|5|6|7|8|9])\\d{8}$')]],
      'address': [editingRow.address, [
        Validators.required,
        Validators.pattern('^.{10,20}$')
      ]],
      'introduce': [editingRow.introduce, Validators.pattern('^.{0,50}$')],
      'sex': [editingRow.sex],
      'hobby': [editingRow.hobby.split(','), Validators.required],
      'province': [editingRow.province, Validators.pattern('^[^"0"].*$')],
      'city': [editingRow.city, Validators.pattern('^[^"0"].*$')],
      'area': [editingRow.area, Validators.pattern('^[^"0"].*$')]
    });
    console.log(this.itemForForm.value);
    console.log('createItemForForm-------end');
  }

  /**
   * 保存添加、编辑-提交表单
   */
  onSubmitForm(itemForForm): void {
    console.log('onSubmitForm---------');
    console.log(itemForForm.valid);
    console.log(itemForForm.value);
  }

  /**
   * 取消添加、编辑
   */
  onEditCancel(): void {
    this.editDlgState = true; // 触发onCloseEditDlg事件关闭弹框
  }

  /**
   * 关闭添加、编辑弹框
   */
  onCloseEditDlg(): void {
    this.editingRow = undefined;
    this.levelOne = undefined;
    this.levelTwo = undefined;
    this.levelThree = undefined;
    this.itemForForm.reset(); // 重置表单
    this.editDlgState = true; // 关闭弹框
  }

  /**
   * 复选框点击事件
   * @param event
   */
  onChangeHobby(hobby) {
    console.log('onChangeHobby-----start');
    const index = this.itemForForm.value.hobby.indexOf(hobby);
    if (index === -1) {
      this.itemForForm.value.hobby.push(hobby);
    } else {
      this.itemForForm.value.hobby.splice(index, 1);
    }
    console.log(this.itemForForm.value.hobby);
    console.log('onChangeHobby-----end');
  }

  /**
   * 一级下拉列表change事件
   * @param selectedOption
   */
  onChangeLevelOne(selectedOption): void {
    console.log('onChangeLevelOne--------start');
    this.itemForForm.patchValue({'province': selectedOption.value}); // 设置表单对象province属性值为当前下拉列表值
    if (selectedOption.value === '0') { // 当前一级下拉列表选中值为'0'时
      this.levelTwo = undefined; // 屏蔽二级下拉列表
    } else { // 当前一级下拉列表选中值不为'0'时
      if (this.editState) { // true表示编辑数据
        if (this.levelTwo) {
          this.levelTwo = this.levelOne[selectedOption.selectedIndex - 1].child; // 获取二级下拉列表数据
          this.itemForForm.patchValue({'city': '0'}); // 设置表单对象city属性值为'0'
        } else {
          this.levelTwo = undefined; // 屏蔽二级下拉列表
          this.itemForForm.patchValue({'city': null}); // 设置表单对象city属性值为null避开校验规则
        }
      } else { // false表示添加数据
        for (let i = 0; i < this.levelOne.length; i++) {
          if (this.levelOne[i].id === selectedOption.value) {
            this.levelTwo = this.levelOne[i].child;
            this.itemForForm.patchValue({'city': '0'}); // 设置表单对象city属性值为'0'
            break;
          } else {
            this.levelTwo = undefined;
            this.itemForForm.patchValue({'city': null}); // 设置表单对象city属性值为null避开校验规则
          }
        }
      }
    }
    this.levelThree = undefined; // 屏蔽三级下拉列表
    console.log(this.itemForForm.controls['province'].value);
    console.log('onChangeLevelOne--------end');
  }

  /**
   * 二级下拉列表change事件
   * @param selectedOption
   */
  onChangeLevelTwo(selectedOption): void {
    console.log('onChangeLevelTwo--------start');
    this.itemForForm.patchValue({'city': selectedOption.value}); // 设置表单对象city属性值为当前下拉列表值
    if (selectedOption.value === '0') { // 当前二级下拉列表选中值为'0'时
      this.levelThree = undefined; // 屏蔽三级下拉列表
    } else { // 当前二级下拉列表选中值不为'0'时
      // editState = false; // false表示添加数据(默认),true表示编辑数据
      if (this.editState) { // true表示编辑数据
        if (this.levelThree) {
          this.levelThree = this.levelTwo[selectedOption.selectedIndex - 1].child; // 获取三级下拉列表数据
          this.itemForForm.patchValue({'area': '0'}); // 设置表单对象area属性值为'0'
        } else {
          this.levelThree = undefined; // 屏蔽三级下拉列表
          this.itemForForm.patchValue({'area': null}); // 设置表单对象area属性值为null避开校验规则
        }
      } else { // false表示添加数据
        for (let i = 0; i < this.levelTwo.length; i++) {
          if (this.levelTwo[i].id === selectedOption.value) {
            this.levelThree = this.levelTwo[i].child;
            this.itemForForm.patchValue({'area': '0'}); // 设置表单对象area属性值为'0'
            break;
          } else {
            this.levelThree = undefined;
            this.itemForForm.patchValue({'area': null}); // 设置表单对象area属性值为null避开校验规则
          }
        }
      }
    }
    console.log(this.itemForForm.controls['city'].value);
    console.log('onChangeLevelTwo--------end');
  }

  /**
   * 三级下拉列表change事件
   * @param selectedOption
   */
  onChangeLevelThree(selectedOption): void {
    console.log('onChangeLevelThree--------start');
    this.itemForForm.patchValue({'area': selectedOption.value}); // 设置表单对象area属性值为当前下拉列表值
    console.log(this.itemForForm.controls['area'].value);
    console.log('onChangeLevelThree--------ebd');
  }

  /**
   * 刷新数据
   */
  onReLoad(): void {
    this.itemForPage = {};
    this.page();
  }

  /**
   * 清空分页查询条件
   */
  onCleanSearch(): void {
    this.itemForPage = {};
  }

  /**
   * row 样式定义
   * @param row
   */
  setRowCss(row) {
    // if (row.email === 'lisi13_java@163.com') {
    //   return {background: '#b8eecf', fontSize: '14px', fontStyle: 'italic'};
    // }
    return null;
  }

  /**
   * sex cell 样式定义
   * @param row
   * @param value
   * @returns {{color: string}}
   */
  setSexCellCss(row, value) {
    if (value === 'male') {
      return {color: 'blue'};
    } else {
      return {color: 'red'};
    }
  }

}
