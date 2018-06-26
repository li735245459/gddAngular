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
  hobbys: any;
  hobby1 = false;
  hobby2 = false;
  hobby3 = false;
  // 省、市、区数据级联
  levelOne: any; // 一级数据,默认为undefine
  levelTwo: any; // 二级数据,默认为undefine
  levelThree: any; // 二级数据,默认为undefine
  levelOneValue: any; // 一级数据节点值,默认为undefine(通过级联下拉菜单回调事件修改值)
  levelTwoValue: any; // 二级数据节点值,默认为undefine(通过级联下拉菜单回调事件修改值)
  levelThreeValue: any; // 三级数据节点值,默认为undefine(通过级联下拉菜单回调事件修改值)

  constructor(
    private userService: UserService,
    private formBuilder: FormBuilder) {
    this.createItemForForm(); // 创建表单对象
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
   * 双击行打开编辑框
   * @param event
   */
  onRowDblClick(event): void {
    this.editDlgTitle = '编辑用户信息';
    this.editingRow = event;
    this.createItemForForm(); // 重新创建表单对象
    this.editDlgState = false; // 打开编辑弹框
  }

  /**
   * 添加数据-打开添加框
   */
  onAdd(): void {
    this.editDlgTitle = '添加用户信息';
    this.editingRow = undefined;
    this.createItemForForm(); // 重新创建表单对象
    this.editDlgState = false; // 打开添加弹框
  }

  /**
   * 创建表单对象
   */
  createItemForForm(): void {
    this.msg = '';
    if (this.editingRow) { // 当前操作类型: 编辑用户信息
      // 将字符串转化成数组,动态添加、删除用户的hobby,提交时需要转换成字符串添加到表单对象的hobby属性中
      this.hobbys = this.editingRow.hobby.split(',');
      /**
       * 设置hobby复选框选中状态
       */
      if (this.editingRow.hobby.includes('1')) {
        this.hobby1 = true;
      } else {
        this.hobby1 = false;
      }
      if (this.editingRow.hobby.includes('2')) {
        this.hobby2 = true;
      } else {
        this.hobby2 = false;
      }
      if (this.editingRow.hobby.includes('3')) {
        this.hobby3 = true;
      } else {
        this.hobby3 = false;
      }
      /**
       * 解析级联数据
       */
      if (this.editingRow.province) { // 判断levelOne是否存在
        this.levelOne = china; // 设置levelOne
        if (this.editingRow.city) { // 判断levelTwo是否存在
          for (let i = 0; i < this.levelOne.length; i++) {
            if (this.levelOne[i].id === this.editingRow.province) {
              this.levelTwo = this.levelOne[i].child; // 设置levelTwo
              if (this.editingRow.area) { // 判断levelThree是否存在
                for (let j = 0; j < this.levelTwo.length; j++) {
                  if (this.levelTwo[j].id === this.editingRow.city) {
                    this.levelThree = this.levelTwo[j].child; // 设置levelThree
                  }
                }
              } else {
                this.levelThree = null;
              }
            }
          }
        }
      }
    } else { // 当前操作类型: 添加用户信息
      this.editingRow = new User();
      this.levelOne = china; // 获取一级下拉列表数据
      this.editingRow.province = '0'; // 设置一级下拉列表默认选中值为'0'
      this.editingRow.sex = 'male'; // 设置默认sex属性值为male
      this.hobbys = [];
    }
    /**
     * 实例化表单对象
     */
    this.levelOneValue = this.editingRow.province;
    this.levelTwoValue = this.editingRow.city;
    this.levelThreeValue = this.editingRow.area;
    this.itemForForm = this.formBuilder.group({
      'name': [this.editingRow.name, [
        Validators.required,
        Validators.pattern('^[\u4e00-\u9fa5]{2,5}$')]],
      'email': [this.editingRow.email, [
        Validators.required,
        Validators.pattern('^\\w+([-+.]\\w+)*@\\w+([-.]\\w+)*\\.\\w+([-.]\\w+)*$')]],
      'phone': [this.editingRow.phone, [
        Validators.required,
        Validators.pattern('^(13[0-9]|14[5|7]|15[0|1|2|3|5|6|7|8|9]|18[0|1|2|3|5|6|7|8|9]|17[0|1|2|3|5|6|7|8|9])\\d{8}$')]],
      'address': [this.editingRow.address, [
        Validators.required,
        Validators.pattern('^.{10,20}$')
      ]],
      'introduce': [this.editingRow.introduce, Validators.pattern('^.{0,50}$')],
      'sex': [this.editingRow.sex, Validators.required],
      'hobby': [this.editingRow.hobby, Validators.required],
      'province': [this.levelOneValue, Validators.pattern('^[^"0"]*$')],
      'city': [this.levelTwoValue, Validators.pattern('^[^"0"]*$')],
      'area': [this.levelThreeValue, Validators.pattern('^[^"0"]*$')]
    });
  }

  /**
   * 保存添加、编辑-提交表单
   */
  onSubmitForm(itemForForm): void {
    console.log('onSubmitForm---------');
    console.log(this.hobbys);
    console.log(itemForForm);
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
    this.levelOneValue = undefined;
    this.levelTwoValue = undefined;
    this.levelThreeValue = undefined;
    this.editDlgState = true;
  }

  /**
   * 复选框点击事件
   * @param event
   */
  onChangeHobby(hobby) {
    const index = this.hobbys.indexOf(hobby);
    if (index === -1) {
      this.hobbys.push(hobby);
    } else {
      this.hobbys.splice(index, 1);
    }
    console.log(this.hobbys);
  }

  /**
   * 一级下拉列表change事件
   * @param selectedOption
   */
  onChangeLevelOne(selectedOption): void {
    this.levelOneValue = selectedOption.value; // 保存一级下拉列表选中的节点值
    if (selectedOption.value === '0') { // 当前一级下拉列表选中值为'0'时
      this.levelTwo = undefined; // 屏蔽二级下拉列表
    } else { // 当前一级下拉列表选中值不为'0'时
      this.levelTwo = this.levelOne[selectedOption.selectedIndex - 1].child; // 获取二级下拉列表数据
      this.levelTwoValue = '0'; // 设置二级下拉列表默认选中值为'0'
      this.itemForForm.patchValue({'city': this.levelTwoValue}); // 动态设置表单对象中的city属性值
    }
    this.levelThree = undefined; // 屏蔽三级下拉列表
    console.log(this.levelOneValue);
  }

  /**
   * 二级下拉列表change事件
   * @param selectedOption
   */
  onChangeLevelTwo(selectedOption): void {
    this.levelTwoValue = selectedOption.value; // 保存二级下拉列表选中的节点值
    if (selectedOption.value === '0') { // 当前二级下拉列表选中值为'0'时
      this.levelThree = undefined; // 屏蔽三级下拉列表
    } else { // 当前二级下拉列表选中值不为'0'时
      this.levelThree = this.levelTwo[selectedOption.selectedIndex - 1].child; // 获取三级下拉列表数据
      this.levelThreeValue = '0'; // 设置三级下拉列表默认选中值为'0'
      this.itemForForm.patchValue({'area': this.levelThreeValue}); // 动态设置表单对象中的area属性值
    }
    console.log(this.levelTwoValue);
  }

  /**
   * 三级下拉列表change事件
   * @param selectedOption
   */
  onChangeLevelThree(selectedOption): void {
    this.levelThreeValue = selectedOption.value; // 保存三级下拉列表选中的节点值
    console.log(this.levelThreeValue);
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
