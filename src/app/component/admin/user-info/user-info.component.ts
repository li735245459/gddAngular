import {AfterViewInit, Component, OnInit, ViewEncapsulation, OnDestroy, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {MessagerService} from 'ng-easyui/components/messager/messager.service';
import {Router} from '@angular/router';
import {interval, Subscription} from 'rxjs';
import {FileButtonComponent} from 'ng-easyui/components/filebutton/filebutton.component';

import {User} from '../../../globalModel/User';
import {UserService} from '../../../service/user.service';
import {AdminService} from '../../../service/admin.service';
import {hobby, province} from '../../../globalModel/JsonLocalData';
import {HttpEventType} from '@angular/common/http';

@Component({
  selector: 'app-user-info',
  templateUrl: './user-info.component.html',
  styleUrls: ['./user-info.component.css'],
  encapsulation: ViewEncapsulation.None
})

export class UserInfoComponent implements OnInit, AfterViewInit, OnDestroy {
  msg: string = null; // 全局提示消息
  title = '用户信息'; // 组建标题
  adminSelectedMenuSubscription: Subscription = null; // 父子组将通讯的订阅对象
  // 表格
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
  selectRow = []; // 存储点击某一行后选中的行（数组）
  itemForPage: User = {sex: '0'}; // 分页查询条件参数（双向数据绑定）
  // 添加、编辑弹框
  editDlgTitle: String = '添加、编辑用户信息';
  editRow: User = new User(); // 当前需要编辑的数据
  editDlgClosed = true; // 默认关闭弹框,false打开弹框
  // 删除弹框
  deleteDlgTitle = '删除用户信息';
  deleteDlgClosed = true; // 默认关闭弹框,false打开弹框
  deleteDlgBtnDisabled = false; // 默认禁用(确认、取消)按钮,false表示激活(确认、取消)按钮
  deleteState = false; // true删除所有数据,false删除当前选中的数据
  // excel上传文件弹框
  upExcelDlgTitle: String = null;
  upExcelDlgClosed = true; // 默认关闭弹框,false打开弹框
  @ViewChild(FileButtonComponent)
  private fileButtonComponent: FileButtonComponent;
  // 进度条弹框
  // progressDlgClosed = true; // true关闭弹框,false打开弹框
  upProgressValue = 0;
  downProgressValue = 0;
  // 表单
  itemForForm: FormGroup = null; // 表单对象
  formBtnDisabled = false; // true禁止表单提交,false启用表单提交
  formValidSuccess = true; // true表单校验成功样式, false表单校验失败样式
  placeholder = {
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
      初始化数据为本地数组对象hobby：[{'id':'1','name':'篮球'},{'id':'2','name':'足球'}]
      存储数据库的值为id字符串：'1,2'
    添加数据时,创建表单对象时的hobby属性值为：[]
    编辑数据时,创建表单对象时的hobby属性值为：'1,2'.split(',') => [1,2]
    当用户点击复选框时触发change回调函数对表单对象hobby属性值以数组的形式进行动态添加或删除
    当用户提交表单时需将表单对象hobby属性值转化成字符串：[1,2].join(',') => '1,2'
    当用户提交表单后服务器执行失败需将表单对象hobby属性值转化成数组：'1,2'.split(',') => [1,2]
   */
  hobby = hobby;
  /*
    省、市、区级联下拉列表:
      初始化数据为本地数组对象province
    添加、编辑时,创建表单对象时的province属性值为0。级联操作时没有触发的下拉列表需动态设置其相应表单对象属性值为-1
   */
  levelOne: any = null; // 一级数据
  levelTwo: any = null; // 二级数据
  levelThree: any = null; // 二级数据

  /**
   * 构造函数
   */
  constructor(
    private service: UserService,
    private formBuilder: FormBuilder,
    private messagerService: MessagerService,
    private router: Router,
    private adminService: AdminService) {
    this.createItemForForm(); // 创建表单对象
  }

  /**
   * 在第一轮 ngOnChanges 完成之后调用,此时所有输入属性都已经有了正确的初始绑定值
   */
  ngOnInit() {
    this.adminService.pushAdminSelectedMenu({ // 发布订阅
      iconCls: 'sidemenu-default-icon',
      link: 'user',
      parent: null,
      text: '用户信息'
    });
  }

  /**
   * 组建销毁
   */
  ngOnDestroy() {
    if (this.adminSelectedMenuSubscription) {
      this.adminSelectedMenuSubscription.unsubscribe(); // 取消订阅,防止内存泄漏
    }
  }

  /**
   * 在组件相应的视图初始化之后调用
   */
  ngAfterViewInit() {
    this.onPageChange({pageNumber: 1, pageSize: this.pageSize});
  }

  /**
   * 筛选
   */
  onScreening(): void {
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
   * 分页查询
   */
  page() {
    this.service.page(this.itemForPage, this.pageNumber, this.pageSize).subscribe(responseJson => {
      this.loading = false; // 关闭加载提示
      if (responseJson.code === 0) {
        this.data = responseJson.data.list;
        this.total = responseJson.data.total;
      }
    });
  }

  /**
   * 打开删除弹框
   */
  onOpenDeleteDlg(param): void {
    if (param === 'deleteMore') {
      /*
        删除所选
       */
      this.deleteState = false;
      this.deleteDlgTitle = '删除数据';
      if (this.selectRow.length > 0) {
        this.msg = '确定要删除所选数据!';
      } else {
        this.deleteDlgBtnDisabled = true; // 禁用弹框(确认、取消)按钮
        this.msg = '请先选中需要删除的数据';
      }
    } else {
      /*
        删除所有
       */
      this.deleteState = true;
      this.deleteDlgTitle = '清空数据';
      this.msg = '确定要删除所有数据!';
    }
    this.deleteDlgClosed = false; // 打开弹框
  }

  /**
   * 确认删除
   */
  onDeleteSure(): void {
    this.deleteDlgBtnDisabled = true; // 禁用弹框(确认、取消)按钮
    let id = null;
    /*
      根据删除类型封装需要删除的数据id
     */
    if (this.deleteState) {
      id = 'all';
    } else {
      id = this.selectRow.map(row => row.id).join(',');
    }
    this.service.delete(id).subscribe(responseJson => {
      if (responseJson.code === 0) {
        /*
          操作成功
         */
        this.msg = '删除成功！';
        setTimeout(() => {
          this.onPageChange({pageNumber: this.pageNumber, pageSize: this.pageSize}); // 重置当前分页数据
          this.deleteDlgClosed = true; // 关闭弹框
        }, 500);
      } else {
        /*
          操作失败
         */
        this.msg = '删除失败！';
        this.deleteDlgBtnDisabled = false; // 激活弹框(确认、取消)按钮
      }
    });
  }

  /**
   * 点击添加按钮打开添加弹框
   * 双击行打开编辑弹框
   * @param param
   */
  onOpenEditDlg(param): void {
    this.selectRow = []; // 取消点击选中的数据
    if (param === 'add') {
      /*
        添加
       */
      this.editDlgTitle = '添加用户信息';
      this.levelOne = province; // 初始化levelOne数据,levelTwo和levelThree由用户选择生成
      this.editRow.province = '0'; // 设置一级下拉列表初始值为'0'
      this.editRow.city = '-1'; // 设置二级下拉列表值为'-1',表示该项地址不存在
      this.editRow.area = '-1'; // 设置三级下拉列表值为'-1',表示该项地址不存在
    } else {
      /*
        编辑
       */
      this.editDlgTitle = '编辑用户信息';
      this.editRow = param;
      if (this.editRow.province && this.editRow.province !== '-1') { // province存在
        this.levelOne = province; // 初始化levelOne
        if (this.editRow.city && this.editRow.city !== '-1') { // city存在
          for (let i = 0; i < this.levelOne.length; i++) {
            if (this.levelOne[i].name === this.editRow.province) {
              this.levelTwo = this.levelOne[i].child; // 初始化levelTwo
              if (this.editRow.area && this.editRow.area !== '-1') { // area存在
                for (let j = 0; j < this.levelTwo.length; j++) {
                  if (this.levelTwo[j].name === this.editRow.city) {
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
    }
    this.createItemForForm(); // 创建表单对象
    this.editDlgClosed = false; // 打开弹框
  }

  /**
   * 创建表单对象
   */
  createItemForForm(): void {
    this.itemForForm = this.formBuilder.group({
      'name': [this.editRow.name, [
        Validators.required,
        Validators.pattern('^[\u4e00-\u9fa5]{2,5}$')]],
      'email': [this.editRow.email, [
        Validators.required,
        Validators.pattern('^\\w+([-+.]\\w+)*@\\w+([-.]\\w+)*\\.\\w+([-.]\\w+)*$')]],
      'phone': [this.editRow.phone, [
        Validators.required,
        Validators.pattern('^(13[0-9]|14[5|7]|15[0|1|2|3|5|6|7|8|9]|18[0|1|2|3|5|6|7|8|9]|17[0|1|2|3|5|6|7|8|9])\\d{8}$')]],
      'address': [this.editRow.address, [
        Validators.required,
        Validators.pattern('^.{4,20}$')
      ]],
      'introduce': [this.editRow.introduce, Validators.pattern('^.{0,50}$')],
      'sex': [this.editRow.sex, [Validators.required, Validators.pattern('^["男"|"女"].*$')]], // 单选按钮
      'hobby': [this.editRow.hobby ? this.editRow.hobby.split(',') : []], // 存储选中的复选框的值
      'province': [this.editRow.province, Validators.pattern('^[^"0"].*$')],
      'city': [this.editRow.city, Validators.pattern('^[^"0"].*$')],
      'area': [this.editRow.area, Validators.pattern('^[^"0"].*$')]
    });
    // 动态添加表单对象属性
    for (let i = 0; i < this.hobby.length; i++) {
      const hobbyName = `hobby${i + 1}`;
      if (this.editRow && this.editRow.hobby && this.editRow.hobby.includes(this.hobby[i].name)) {
        this.itemForForm.addControl(hobbyName, new FormControl(this.hobby[i].name)); // 编辑状态下设置hobbyName属性对象的值
      } else {
        this.itemForForm.addControl(hobbyName, new FormControl(null)); // 添加状态下设置hobbyName属性对象的值为null
      }
    }
  }

  /**
   * 保存添加、编辑-提交表单
   */
  onSubmitForm(itemForForm): void {
    this.formBtnDisabled = true; // 禁用表单提交
    if (this.editRow && this.editRow.id) {
      /*
        编辑状态
       */
      itemForForm.value.id = this.editRow.id; // 设置ID作为后台修改的凭证
      if (this.editRow.email === this.itemForForm.value.email) {
        this.itemForForm.value.email = null; // 邮箱没有发生改变时设置为null
      }
      if (this.editRow.phone === this.itemForForm.value.phone) {
        this.itemForForm.value.phone = null; // 手机号码没有发生改变时设置为null
      }
    }
    itemForForm.value.hobby = itemForForm.value.hobby.join(','); // 将hobby数组转化成字符串
    this.service.modify(itemForForm.value).subscribe(responseJson => {
      if (responseJson.code === 0) {
        /*
          操作成功
         */
        setTimeout(() => {
          this.onPageChange({pageNumber: this.pageNumber, pageSize: this.pageSize}); // 重置当前分页数据
          this.editDlgClosed = true; // 关闭弹框
        }, 500);
      } else {
        /*
          操作失败
         */
        this.itemForForm.value.hobby = this.itemForForm.value.hobby.split(','); // 将hobby字符串转化成数组
        this.formBtnDisabled = false; // 激活表单提交按钮
      }
    });
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
   * 一级下拉列表change事件
   *  值为'0',置空所有级联下拉列表数据以及表单相关属性对象
   *  值不为'0',设置二级联下拉列表数据以及表单相关属性对象
   * @param selectedOption
   */
  onChangeLevelOne(selectedOption): void {
    this.itemForForm.patchValue({'province': selectedOption.value}); // 设置表单对象province属性值为当前选中值
    if (selectedOption.value !== '0' && this.levelOne[selectedOption.selectedIndex - 1].child) {
      this.levelTwo = this.levelOne[selectedOption.selectedIndex - 1].child; // 显示二级下拉列表
      this.itemForForm.patchValue({'city': '0'}); // 设置表单对象city属性值为'0'
    } else {
      this.levelTwo = null; // 屏蔽二级下拉列表
      this.itemForForm.patchValue({'city': '-1'}); // 设置表单对象city属性值为'-1'
    }
    this.levelThree = null; // 屏蔽三级下拉列表
    this.itemForForm.patchValue({'area': '-1'}); // 设置表单对象area属性值为'-1'
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
      this.levelThree = this.levelTwo[selectedOption.selectedIndex - 1].child;
      this.itemForForm.patchValue({'area': '0'});
    } else {
      this.levelThree = null;
      this.itemForForm.patchValue({'area': '-1'});
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
   * excel操作栏
   */
  excel(param): void {
    if (param.includes('import')) {
      /*
        导入操作
       */
      this.upExcelDlgTitle = '导入Excel表格';
      this.upExcelDlgClosed = false; // 打开Excel弹框
    } else {
      /*
        导出操作
       */
      let progressSubscribe;
      this.service.export(this.itemForPage).subscribe((event) => {
        switch (event.type) {
          case HttpEventType.Sent: // 请求已发送
            // 开启进度条订阅
            progressSubscribe = interval(500).subscribe(() => {
              this.downProgressValue += Math.floor(Math.random() * 20);
              if (this.downProgressValue > 100) {
                this.downProgressValue = 10;
              }
            });
            break;
          case HttpEventType.Response: // 已接受全部响应,包含响应体
            // 关闭进度条订阅
            progressSubscribe.unsubscribe();
            // 关闭进度条弹框
            this.downProgressValue = 0;
            // 文件二进制数据
            const blob = new Blob([event.body], {'type': 'application/vnd.ms-excel'}); // .xls
            const fileName = '用户信息';
            if (window.navigator.msSaveOrOpenBlob) {
              // For IE浏览器
              navigator.msSaveBlob(blob, fileName);
            } else {
              // For 其他浏览器
              const objectUrl = URL.createObjectURL(blob);
              const a = document.createElement('a');
              document.body.appendChild(a);
              a.setAttribute('style', 'display:none');
              a.setAttribute('href', objectUrl);
              a.setAttribute('download', fileName);
              a.click();
              URL.revokeObjectURL(objectUrl);
              a.remove();
            }
            break;
        }
      });
    }
  }

  /**
   * 选择文件并上传
   */
  onFileSelect(fileList): void {
    switch (fileList.length) {
      case 0:
        this.messagerService.alert({title: '温馨提示', msg: '请选择文件!', ok: '确定'});
        break;
      case 1:
        const file: File = fileList[0];
        /*
          判断文件类型
         */
        const fileType = file.type;
        if (fileType !== 'application/vnd.ms-excel' && fileType !== 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
          this.messagerService.alert({title: '温馨提示', msg: '请选择格式为xls或xlsx的Excel文件', ok: '确定'});
          return;
        }
        /*
          判断文件大小,单个文件5M以内
         */
        const fileSize = file.size;
        if (fileSize > (5 * 1024 * 1024)) {
          this.messagerService.alert({title: '温馨提示', msg: '请选择5M以内的Excel文件', ok: '确定'});
          return;
        }
        /*
          上传文件
        */
        const formData: FormData = new FormData();
        formData.set('file', file);
        this.service.import(formData).subscribe(event => {
          switch (event.type) {
            case HttpEventType.Sent: // 请求已发送
              this.upProgressValue = 10;
              break;
            case HttpEventType.UploadProgress: // 上传进度事件回调
              const percentDone = Math.round(100 * event.loaded / event.total);
              this.upProgressValue = percentDone - 10;
              break;
            case HttpEventType.Response: // 已接受全部响应,包含响应体
              this.upProgressValue = 100;
              if (event.body.code === 0) {
                /*
                  操作成功
                 */
                setTimeout(() => {
                  this.onPageChange({pageNumber: this.pageNumber, pageSize: this.pageSize}); // 更新当前分页数据
                  this.upExcelDlgClosed = true;
                }, 500);
              } else {
                /*
                  操作失败
                 */
                this.upProgressValue = 0; // 重置进度条
              }
              break;
          }
        });
        break;
    }
    this.fileButtonComponent.clear(); // 清空选择的文件
  }

  /**
   * 刷新首页数据
   */
  onReLoad(): void {
    this.clean();
    this.onPageChange({pageNumber: 1, pageSize: this.pageSize});
  }

  /**
   * 清空筛选条件
   */
  onCleanScreening(): void {
    this.clean();
  }

  /**
   * 取消删除
   */
  onDeleteCancel(): void {
    this.onCloseDlg();
  }

  /**
   * 取消添加、编辑
   */
  onEditCancel(): void {
    this.onCloseDlg();
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
    this.msg = null;
    this.editRow = new User();
    this.editDlgClosed = true;
    this.selectRow = [];
    this.deleteState = false;
    this.deleteDlgClosed = true;
    this.deleteDlgBtnDisabled = false;
    this.upExcelDlgClosed = true;
    this.itemForPage = {sex: '0'};
    this.formBtnDisabled = false;
    this.formValidSuccess = true;
    this.levelOne = null;
    this.levelTwo = null;
    this.levelThree = null;
    this.upProgressValue = 0;
    this.downProgressValue = 0;
  }

  /**
   * 样式定义
   */
  setRowCss(row) {
    if (row.email === 'lisi13_java@163.com') {
      return {background: '#b8eecf', fontSize: '14px', fontStyle: 'italic'};
    }
    return null;
  }

  /**
   * 样式定义
   */
  setSexCellCss(row, value) {
    if (value === '男') {
      return {color: 'blue'};
    }
  }

}
