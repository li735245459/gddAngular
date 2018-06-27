import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {UserService} from '../../../service/user.service';
import {User} from '../../../model/user';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';

import {province, hobby} from '../../../data/UserData';

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
  editRow: User; // 当前需要编辑的数据,默认为undefine
  editDlgState = true; // false弹框打开,true弹框关闭(默认)
  // 删除弹框
  selectedRow; // 当前选中的行(可多选,[{},{}])
  deleteDlgTitle; // 弹框标题
  deleteState = false; // false表示删除选择数据(默认),true表示删除所有数据
  deleteDlgBtnState = false; // 弹框按钮状态,false表示可用(默认),true表示禁用
  deleteDlgState = true; // false弹框打开,true弹框关闭(默认)
  // 表单
  itemForForm: FormGroup; // 表单对象
  formSubmitState = false; // true禁止表单提交,默认false
  formValidStyle; // 0表单校验成功样式, 1表单校验失败样式
  placeholder = { // 表单字段说明
    name: {'title': '姓名', 'prompt': '(2~4位汉子)'},
    phone: {'title': '手机号码', 'prompt': '(11位数字)'},
    email: {'title': '邮箱', 'prompt': '(you@example.com)'},
    password: {'title': '密码', 'prompt': '(字母开头的6~10位字母、数字和下划线)'},
    rePassword: {'title': '重复密码', 'prompt': ''},
    address: {'title': '详细地址', 'prompt': '(10~20位字符)'},
    introduce: {'title': '自我介绍', 'prompt': ''}
  };
  /*
    hobby类型为checkbox:
      初始化加载数据为本地json数组对象-[{'id':'1','name':'篮球'},{'id':'2','name':'足球'}]
      用户选择后存取数据库的值为id字符串--'1,2'
    添加数据时,创建表单对象时该属性值为[]
    编辑数据时,创建表单对象时该属性值为--'1,2'.split(',')) => [1,2]
    当用户点击复选框时触发change回调函数对表单对象hobby属性值进行动态修改
    当用户提交表单时将表单对象hobby属性值转化成字符串--[1,2].join(',') => '1,2'
   */
  hobby = hobby;
  /*
    省、市、区类型为级联下拉列表:
      初始化加载数据为本地json对象
      用户选择后存取数据库的值为下拉列表的值
    添加数据时,
   */
  levelOne: any; // 一级数据,默认为undefine
  levelTwo: any; // 二级数据,默认为undefine
  levelThree: any; // 二级数据,默认为undefine

  constructor(
    private userService: UserService,
    private formBuilder: FormBuilder) {
    this.createItemForForm(this.editRow); // 初始化创建空的表单对象(必须)
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
    // this.pageNumber = (event.pageNumber === 0 ? 1 : event.pageNumber);
    // this.pageSize = event.pageSize;
    // this.page();
  }

  /**
   * 查询按钮触发分页查询
   */
  onSearch(): void {
    this.page();
  }

  /**
   * 分页查询
   */
  page() {
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
    this.deleteDlgState = true; // 触发onCloseDeleteDlg事件关闭弹框
  }

  /**
   * 关闭删除弹框
   */
  onCloseDeleteDlg(): void {
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
      this.editDlgTitle = '添加用户信息';
      this.editRow = undefined;
      this.editState = false;
    } else {
      this.editDlgTitle = '编辑用户信息';
      this.onUnSelect();
      this.editRow = param;
      this.editState = true;
    }
    this.createItemForForm(this.editRow); // 创建新的表单对象
    this.editDlgState = false; // 打开添加弹框
  }

  /**
   * 创建表单对象
   */
  createItemForForm(editRow): void {
    this.msg = '';
    // editState为true表示编辑用户信息
    if (this.editState) {
      // 解析级联数据,回显下拉列表
      // 判断province是否存在
      if (editRow.province) {
        this.levelOne = province; // 初始化levelOne
        // 判断city是否存在
        if (editRow.city) {
          for (let i = 0; i < this.levelOne.length; i++) {
            if (this.levelOne[i].id === editRow.province) {
              this.levelTwo = this.levelOne[i].child; // 初始化levelTwo
              // 判断area是否存在
              if (editRow.area) {
                for (let j = 0; j < this.levelTwo.length; j++) {
                  if (this.levelTwo[j].id === editRow.city) {
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
    } else { // editState为false表示添加用户信息
      this.levelOne = province; // 初始化levelOne数据,levelTwo和levelThree由用户选择生成
      editRow = new User();
      editRow.province = '0'; // 设置一级下拉列表值为'0'
    }
    /**
     * 创建表单对象
     */
    this.itemForForm = this.formBuilder.group({
      'name': [editRow.name, [
        Validators.required,
        Validators.pattern('^[\u4e00-\u9fa5]{2,5}$')]],
      'email': [editRow.email, [
        Validators.required,
        Validators.pattern('^\\w+([-+.]\\w+)*@\\w+([-.]\\w+)*\\.\\w+([-.]\\w+)*$')]],
      'phone': [editRow.phone, [
        Validators.required,
        Validators.pattern('^(13[0-9]|14[5|7]|15[0|1|2|3|5|6|7|8|9]|18[0|1|2|3|5|6|7|8|9]|17[0|1|2|3|5|6|7|8|9])\\d{8}$')]],
      'address': [editRow.address, [
        Validators.required,
        Validators.pattern('^.{10,20}$')
      ]],
      'introduce': [editRow.introduce, Validators.pattern('^.{0,50}$')],
      'sex': [editRow.sex, Validators.pattern('^["male"|"female"].*$')],
      'hobby': [this.editState ? editRow.hobby.split(',') : []],
      'province': [editRow.province, Validators.pattern('^[^"0"].*$')]
    });
    /**
     * 编辑状态下,动态添加表单对象的city、area属性对象
     */
    if (this.editState && editRow.city && this.levelTwo) {
      this.itemForForm.addControl('city', new FormControl(editRow.city, Validators.pattern('^[^"0"].*$')));
    }
    if (this.editState && editRow.area && this.levelThree) {
      this.itemForForm.addControl('area', new FormControl(editRow.area, Validators.pattern('^[^"0"].*$')));
    }
    /**
     * 动态加载表单对象的hobby属性对象,添加状态无需回显,编辑状态需要回显
     */
    for (let i = 0; i < this.hobby.length; i++) {
      const hobbyId = this.hobby[i].id;
      const hobbyName = `hobby${hobbyId}`;
      if (this.editState && editRow.hobby.includes(hobbyId)) {
        this.itemForForm.addControl(hobbyName, new FormControl(hobbyId));
      } else {
        this.itemForForm.addControl(hobbyName, new FormControl(null));
      }
    }
  }

  /**
   * 保存添加、编辑-提交表单
   */
  onSubmitForm(itemForForm): void {
    this.formSubmitState = true; // 禁用表单提交
    this.formValidStyle = 0; // 设置全局消息样式为成功
    this.msg = '表单校验成功';
    itemForForm.value.id = this.editRow.id;
    this.userService.modify(itemForForm.value).subscribe(responseJson => {
      if (responseJson.code === 0) {
        this.formSubmitState = true; // 禁用表单提交
        this.formValidStyle = 0; // 设置全局消息样式为成功
        this.msg = '用户信息修改成功';
        setTimeout(() => {
          /**
           * 1)重新分页
           * 2)使用itemForForm.value填充editRow
           */
          this.page();
          this.editDlgState = true; // 关闭窗口
        }, 1000);
      } else {
        this.formSubmitState = false; // 激活表单提交
        this.formValidStyle = 1; // 设置全局消息样式为失败
        this.msg = responseJson.msg;
      }
    });
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
    this.editRow = undefined;
    this.levelOne = undefined;
    this.levelTwo = undefined;
    this.levelThree = undefined;
    this.formSubmitState = false; // 激活表单提交
    this.editDlgState = true; // 关闭弹框
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
