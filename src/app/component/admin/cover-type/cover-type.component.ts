import {AfterViewInit, Component, OnInit, ViewEncapsulation} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {Router} from '@angular/router';
import {Md5} from 'ts-md5';
import {MessagerService} from 'ng-easyui/components/messager/messager.service';
import {CoverType} from '../../../globalModel/coverType';
import {CoverService} from '../../../service/cover.service';

@Component({
  selector: 'app-cover-type',
  templateUrl: './cover-type.component.html',
  styleUrls: ['./cover-type.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class CoverTypeComponent implements OnInit, AfterViewInit {
  msg: string = null; // 全局提示消息
  // 表格
  title = '封面类型信息';
  loading = true; // 开启datagrid加载提示
  loadMsg = '正在加载..';
  total: Number = 0; // 所有数据条数
  data = []; // 分页数据
  pageNumber = 1; // 当前分页号
  pageSize = 20; // 默认分页大小
  pageOptions = { // 分页导航条参数设置
    pageList: [10, 20, 30, 40, 50],
    displayMsg: '当前 {from} 到 {to} , 共 {total} 条',
    layout: ['list', 'sep', 'first', 'prev', 'sep', 'tpl', 'sep', 'next', 'last', 'sep', 'refresh', 'sep', 'links', 'info']
  };
  // 分页参数对象,双向数据绑定
  itemForPage: CoverType = {};
  // 添加、编辑弹框
  editDlgTitle: String = null;
  editRow: CoverType = null; // 当前需要编辑的数据
  editDlgState = true; // true关闭弹框,false打开弹框
  // 删除弹框
  selectedRow = []; // 当前选中的数据
  deleteDlgTitle: String = null;
  deleteState = false; // true删除所有数据,false删除当前选中的数据
  deleteDlgState = true; // true关闭弹框,false打开弹框
  deleteDlgBtnState = false; // true表示禁用,false表示可用
  // 表单
  itemForForm: FormGroup = null; // 表单对象
  formSubmitState = false; // true禁止表单提交,false启用表单提交
  formValidStyle = true; // true表单校验成功样式, false表单校验失败样式
  placeholder = { // 表单字段说明
    name: {'title': '姓名', 'prompt': '(2~4位汉子)'},
    phone: {'title': '手机号码', 'prompt': '(11位数字)'},
    email: {'title': '邮箱', 'prompt': '(you@example.com)'},
    password: {'title': '密码', 'prompt': '(字母开头的6~10位字母、数字和下划线)'},
    rePassword: {'title': '重复密码', 'prompt': ''},
    address: {'title': '详细地址', 'prompt': '(10~20位字符)'},
    introduce: {'title': '自我介绍', 'prompt': ''}
  };

  constructor(
    private service: CoverService,
    private formBuilder: FormBuilder,
    private messagerService: MessagerService,
    private router: Router) {
    // 创建表单对象
    this.createItemForForm(this.editRow);
  }

  /**
   * 在第一轮 ngOnChanges 完成之后调用,此时所有输入属性都已经有了正确的初始绑定值
   */
  ngOnInit() {
  }

  /**
   * 分页查询
   */
  page() {
    this.service.pageByCoverType(this.itemForPage, this.pageNumber, this.pageSize).subscribe(responseJson => {
      switch (responseJson.code) {
        case 0:
          // 成功
          this.data = responseJson.data.list;
          this.total = responseJson.data.total;
          this.loading = false;
          break;
        case 1000:
          // jwt非法
          this.messagerService.confirm({
            title: '温馨提示', msg: '登录超时,是否重新登录!', ok: '确定', cancel: '取消',
            result: (r) => {
              if (r) {
                setTimeout(() => {
                  this.router.navigateByUrl('/login');
                }, 500);
              }
            }
          });
          break;
        case -1:
          // 系统错误
          this.messagerService.alert({title: '温馨提示', msg: '系统错误!', ok: '确定'});
          break;
      }
    });
  }

  /**
   * 在组件相应的视图初始化之后调用
   */
  ngAfterViewInit() {
    this.onPageChange({pageNumber: 1, pageSize: this.pageSize});
  }

  /**
   * 分页插件
   * @param event
   */
  onPageChange(event) {
    if (event.pageNumber > 0) {
      this.pageNumber = event.pageNumber;
      this.pageSize = event.pageSize;
      this.page();
    }
  }

  /**
   * 查询按钮触发分页查询
   */
  onSearch(): void {
    this.onPageChange({pageNumber: 1, pageSize: this.pageSize});
  }

  /**
   * 打开删除弹框
   */
  onOpenDeleteDlg(param): void {
    if (param === 'delete') {
      // ----------------删除所选
      this.deleteState = false; // 删除所选
      this.deleteDlgTitle = '删除数据';
      if (this.selectedRow.length > 0) {
        this.msg = '确定要删除所选数据!';
      } else {
        this.deleteDlgBtnState = true; // 禁用弹框(确认、取消)按钮
        this.msg = '请先选中需要删除的数据';
      }
    } else {
      // ----------------删除所有
      this.deleteState = true; // 删除所有
      this.deleteDlgTitle = '清空数据';
      this.msg = '确定要删除所有数据!';
    }
    this.deleteDlgState = false; // 打开弹框
  }

  /**
   * 确认删除
   */
  onDeleteSure(): void {
    this.deleteDlgBtnState = true; // 禁用删除弹框按钮
    let id = null;
    if (this.deleteState) {
      // ----------------删除所有
      id = 'all';
    } else {
      // ----------------删除所选
      if (this.selectedRow) {
        id = this.selectedRow.map(row => row.id).join(',');
      } else {
        id = null;
      }
    }
    if (id) {
      this.service.delete(id).subscribe(responseJson => {
        switch (responseJson.code) {
          case 0:
            // 成功
            this.deleteDlgBtnState = true; // 禁用弹框按钮
            this.msg = '删除成功！';
            setTimeout(() => {
              this.onPageChange({pageNumber: this.pageNumber, pageSize: this.pageSize}); // 重置当前页数据
              this.deleteDlgState = true; // 关闭弹框
            }, 2000);
            break;
          case 1000:
            // jwt非法
            this.msg = '登录超时！';
            setTimeout(() => {
              this.router.navigateByUrl('/login');
            }, 500);
            break;
          case -1:
            // 系统错误
            this.msg = '删除失败！';
            break;
        }
      });
    }
  }

  /**
   * 取消删除
   */
  onDeleteCancel(): void {
    this.onCloseDlg();
  }

  /**
   * 取消已选择数据
   */
  onUnSelect(): void {
    this.selectedRow = [];
  }

  /**
   * 点击添加按钮打开添加弹框
   * 双击行打开编辑弹框
   * @param param
   */
  onOpenEditDlg(param): void {
    this.selectedRow = []; // 取消选中的数据
    if (param === 'add') {
      this.editDlgTitle = '添加用户信息';
      this.editRow = null;
    } else {
      this.editDlgTitle = '编辑用户信息';
      this.editRow = param;
    }
    this.createItemForForm(this.editRow); // 创建表单对象
    this.editDlgState = false; // 打开弹框
  }

  /**
   * 创建表单对象
   */
  createItemForForm(editRow): void {
    this.msg = '';
    /*初始化表单数据*/
    if (editRow) {
      // 编辑状态下---------------------------------------------------------->
      if (editRow.province && editRow.province !== '-1') { // province存在
        this.levelOne = province; // 初始化levelOne
        if (editRow.city && editRow.city !== '-1') { // city存在
          for (let i = 0; i < this.levelOne.length; i++) {
            if (this.levelOne[i].name === editRow.province) {
              this.levelTwo = this.levelOne[i].child; // 初始化levelTwo
              if (editRow.area && editRow.area !== '-1') { // area存在
                for (let j = 0; j < this.levelTwo.length; j++) {
                  if (this.levelTwo[j].name === editRow.city) {
                    this.levelThree = this.levelTwo[j].child; // 初始化levelThree
                    break;
                  } else {
                    this.levelThree = null;
                  }
                }
              } else {
                this.levelThree = null;
              }
              break;
            } else {
              this.levelTwo = null;
            }
          }
        } else {
          this.levelTwo = null;
        }
      } else {
        this.levelOne = null;
      }
    } else {
      // 添加状态下---------------------------------------------------------->
      editRow = new User();
      this.levelOne = province; // 初始化levelOne数据,levelTwo和levelThree由用户选择生成
      editRow.province = '0'; // 设置一级下拉列表初始值为'0'
      editRow.city = '-1'; // 设置二级下拉列表值为'-1',表示该项地址不存在
      editRow.area = '-1'; // 设置三级下拉列表值为'-1',表示该项地址不存在
    }
    /*创建表单对象*/
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
        Validators.pattern('^.{4,20}$')
      ]],
      'introduce': [editRow.introduce, Validators.pattern('^.{0,50}$')],
      'sex': [editRow.sex, [Validators.required, Validators.pattern('^["男"|"女"].*$')]],
      'hobby': [editRow.hobby ? editRow.hobby.split(',') : []],
      'province': [editRow.province, Validators.pattern('^[^"0"].*$')],
      'city': [editRow.city, Validators.pattern('^[^"0"].*$')],
      'area': [editRow.area, Validators.pattern('^[^"0"].*$')]
    });
    /*动态添加表单对象属性*/
    if (this.editRow) {
      // 编辑状态下---------------------------------------------------------->
      // 添加password属性对象,值为null,删除校验规则
      this.itemForForm.addControl('password', new FormControl(null));
      this.itemForForm.addControl('rePassword', new FormControl(null));
      // 添加hobby复选框属性对象,值为本地hobby数据对象的值
      for (let i = 0; i < this.hobby.length; i++) {
        const hobbyName = `hobby${i + 1}`;
        if (editRow.hobby && editRow.hobby.includes(this.hobby[i].name)) {
          this.itemForForm.addControl(hobbyName, new FormControl(this.hobby[i].name));
        } else {
          this.itemForForm.addControl(hobbyName, new FormControl(null));
        }
      }
    } else {
      // 添加状态下---------------------------------------------------------->
      // 添加password属性对象,值为null,添加校验规则
      this.itemForForm.addControl('password', new FormControl(null, [
        Validators.required, Validators.pattern('^[a-zA-Z]\\w{5,9}$')
      ]));
      this.itemForForm.addControl('rePassword', new FormControl(null, [
        Validators.required, Validators.pattern('^[a-zA-Z]\\w{5,9}$')
      ]));
      // 添加hobby复选框属性对象,值为null
      for (let i = 0; i < this.hobby.length; i++) {
        const hobbyName = `hobby${i + 1}`;
        this.itemForForm.addControl(hobbyName, new FormControl(null));
      }
    }
    // console.log(this.itemForForm.value);
  }

  /**
   * 保存添加、编辑-提交表单
   */
  onSubmitForm(itemForForm): void {
    if (itemForForm.value.password === itemForForm.value.rePassword) {
      if (this.editRow) {
        // 编辑状态下---------------------------------------------------------->
        if (this.editRow.id) {
          itemForForm.value.id = this.editRow.id; // 设置ID作为后台修改的凭证
        }
        if (this.editRow.email === this.itemForForm.value.email) {
          this.itemForForm.value.email = null; // 邮箱没有发生改变时设置为null
        }
        if (this.editRow.phone === this.itemForForm.value.phone) {
          this.itemForForm.value.phone = null; // 手机号码没有发生改变时设置为null
        }
      } else {
        // 添加状态下---------------------------------------------------------->
        itemForForm.value.password = Md5.hashStr(itemForForm.value.password); // 密码加密
        itemForForm.value.rePassword = itemForForm.value.password;
      }
      itemForForm.value.hobby = itemForForm.value.hobby.join(','); // 将hobby数组转化成字符串
      this.service.modify(itemForForm.value).subscribe(responseJson => {
        switch (responseJson.code) {
          case 0:
            // 成功
            this.formSubmitState = true; // 禁用表单提交
            this.formValidStyle = true; // 设置全局消息样式为成功
            this.msg = '操作成功!';
            setTimeout(() => {
              this.onPageChange({pageNumber: this.pageNumber, pageSize: this.pageSize}); // 重置当前页数据
              this.editDlgState = true; // 关闭弹框
            }, 1000);
            break;
          case 1000:
            // jwt非法
            this.msg = '登录超时！';
            setTimeout(() => {
              this.router.navigateByUrl('/login');
            }, 500);
            break;
          case -1:
            // 系统错误
            this.itemForForm.value.hobby = this.itemForForm.value.hobby.split(','); // 将hobby字符串转化成数组
            this.formSubmitState = false; // 激活表单提交按钮
            this.formValidStyle = false; // 设置全局消息样式为失败
            this.msg = responseJson.msg;
            break;
        }
      });
    } else {
      this.msg = '密码不一致';
      this.formValidStyle = false;
      this.formSubmitState = false;
    }
  }

  /**
   * 取消添加、编辑
   */
  onEditCancel(): void {
    this.onCloseDlg();
  }

  /**
   * 复选框点击事件
   * @param checkbox
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
   * 关闭弹框
   */
  onCloseDlg(): void {
    this.clean();
  }

  /**
   * 重置全局参数
   */
  clean(): void {
    this.editDlgTitle = null;
    this.editRow = null;
    this.editDlgState = true;
    this.deleteDlgTitle = null;
    this.selectedRow = [];
    this.deleteState = false;
    this.deleteDlgState = true;
    this.deleteDlgBtnState = false;
    this.formSubmitState = false;
    this.formValidStyle = true;
  }

  /**
   * 清空分页查询条件
   */
  onCleanSearch(): void {
    this.itemForPage = {
      sex: '0'
    };
  }

  /**
   * 刷新数据
   */
  onReLoad(): void {
    this.onCleanSearch();
    this.onPageChange({pageNumber: 1, pageSize: this.pageSize});
  }

}
