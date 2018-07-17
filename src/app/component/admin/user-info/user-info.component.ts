import {AfterViewInit, Component, OnInit, ViewEncapsulation, OnDestroy, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {MessagerService} from 'ng-easyui/components/messager/messager.service';
import {Router} from '@angular/router';
import {interval, Subscription} from 'rxjs';
import {FileButtonComponent} from 'ng-easyui/components/filebutton/filebutton.component';

import {province, hobby} from '../../../globalData/UserData';
import {User} from '../../../globalModel/user';
import {UserService} from '../../../service/user.service';
import {AdminService} from '../../../service/admin.service';

@Component({
  selector: 'app-user-info',
  templateUrl: './user-info.component.html',
  styleUrls: ['./user-info.component.css'],
  encapsulation: ViewEncapsulation.None
})

export class UserInfoComponent implements OnInit, AfterViewInit, OnDestroy {
  msg: string = null; // 全局提示消息
  // 表格
  title = '用户信息';
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
  itemForPage: User = {sex: '0'};
  // 添加、编辑弹框
  editDlgTitle: String = null;
  editRow: User = new User(); // 当前需要编辑的数据
  editDlgState = true; // true关闭弹框,false打开弹框
  // 删除弹框
  selectedRow = []; // 当前选中的数据
  deleteDlgTitle: String = null;
  deleteState = false; // true删除所有数据,false删除当前选中的数据
  deleteDlgState = true; // true关闭弹框,false打开弹框
  deleteDlgBtnState = false; // true表示禁用,false表示可用
  // excel上传文件弹框
  upExcelDlgState = true; // true关闭弹框,false打开弹框
  upExcelDlgTitle: String = null;
  @ViewChild(FileButtonComponent)
  private fileButtonComponent: FileButtonComponent;
  // 进度条弹框
  progressDlgState = true; // true关闭弹框,false打开弹框
  progressValue = 10;
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

  // 后台标题,组件交互测试
  adminTitle = 'GDD宠物馆!';
  adminTitleSubscription: Subscription = null;
  msgSubscription: Subscription = null;

  constructor(
    private service: UserService,
    private formBuilder: FormBuilder,
    private messagerService: MessagerService,
    private router: Router,
    private adminService: AdminService) {
    // 创建表单对象
    this.createItemForForm();
    // 订阅消息,组件交互测试
    adminService.adminTitleSubscription.subscribe(adminTitle => {
      this.adminTitle = adminTitle;
    });
  }

  ngOnDestroy() {
    // 组件销毁时取消订阅,防止内存泄漏
    if (this.msgSubscription) {
      this.msgSubscription.unsubscribe();
    }
    if (this.adminTitleSubscription) {
      this.adminTitleSubscription.unsubscribe();
    }
  }

  /**
   * 在第一轮 ngOnChanges 完成之后调用,此时所有输入属性都已经有了正确的初始绑定值
   */
  ngOnInit() {
  }

  /**
   * 在组件相应的视图初始化之后调用
   */
  ngAfterViewInit() {
    this.onPageChange({pageNumber: 1, pageSize: this.pageSize});
  }

  /**
   * 分页查询
   */
  page() {
    this.service.page(this.itemForPage, this.pageNumber, this.pageSize).subscribe(responseJson => {
      switch (responseJson.code) {
        case 0:
          // 成功
          this.data = responseJson.data.list;
          this.total = responseJson.data.total;
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
        default:
          // 系统错误
          this.messagerService.alert({title: '温馨提示', msg: '系统错误!', ok: '确定'});
          break;
      }
      this.loading = false; // 关闭加载提示
    });
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
    // 推送消息, 组件交互测试
    this.adminService.modifyAdminTitle(this.adminTitle);
    this.adminService.modifyMsg({id: '1', msg: 'msg'});
  }

  /**
   * 打开删除弹框
   */
  onOpenDeleteDlg(param): void {
    if (param === 'deleteMore') {
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
      id = this.selectedRow.map(row => row.id).join(',');
    }
    this.service.delete(id).subscribe(responseJson => {
      switch (responseJson.code) {
        case 0:
          // 成功
          this.deleteDlgBtnState = true; // 禁用弹框按钮
          this.msg = '删除成功！';
          setTimeout(() => {
            this.onPageChange({pageNumber: this.pageNumber, pageSize: this.pageSize}); // 重置当前页数据
            this.deleteDlgState = true; // 关闭弹框
          }, 1000);
          break;
        case 1000:
          // jwt非法
          this.msg = '登录超时！';
          setTimeout(() => {
            this.router.navigateByUrl('/login');
          }, 500);
          break;
        default:
          // 系统错误
          this.msg = '删除失败！';
          break;
      }
    });
  }

  /**
   * 取消删除
   */
  onDeleteCancel(): void {
    this.onCloseDlg();
  }

  /**
   * 点击添加按钮打开添加弹框
   * 双击行打开编辑弹框
   * @param param
   */
  onOpenEditDlg(param): void {
    this.selectedRow = []; // 取消选中的数据
    if (param === 'add') {
      // 添加状态下---------------------------------------------------------->
      this.editDlgTitle = '添加用户信息';
      // 初始化数据
      this.levelOne = province; // 初始化levelOne数据,levelTwo和levelThree由用户选择生成
      this.editRow.province = '0'; // 设置一级下拉列表初始值为'0'
      this.editRow.city = '-1'; // 设置二级下拉列表值为'-1',表示该项地址不存在
      this.editRow.area = '-1'; // 设置三级下拉列表值为'-1',表示该项地址不存在
    } else {
      // 编辑状态下---------------------------------------------------------->
      this.editDlgTitle = '编辑用户信息';
      this.editRow = param;
      // 初始化数据
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
    this.editDlgState = false; // 打开弹框
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
    if (this.editRow && this.editRow.id) {
      // 编辑状态下---------------------------------------------------------->
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
        default:
          // 系统错误、手机号码已被使用、邮箱已被使用
          this.itemForForm.value.hobby = this.itemForForm.value.hobby.split(','); // 将hobby字符串转化成数组
          this.formSubmitState = false; // 激活表单提交按钮
          this.formValidStyle = false; // 设置全局消息样式为失败
          this.msg = responseJson.msg;
          break;
      }
    });
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
   * excel
   */
  excel(param): void {
    if (param.includes('import')) {
      // 导入操作---------------------------------------------------------->
      this.upExcelDlgTitle = '导入Excel表格';
      this.upExcelDlgState = false;
    } else {
      // 导出操作---------------------------------------------------------->
      this.progressDlgState = false; // 打开进度条弹框
      const progressSubscribe = interval(500).subscribe(() => {
        this.progressValue += Math.floor(Math.random() * 20);
        this.progressValue = this.progressValue > 100 ? 10 : this.progressValue;
      });
      this.service.export(this.itemForPage).subscribe((responseBlob) => {
        progressSubscribe.unsubscribe(); // 关闭进度条
        this.progressValue = 10; // 重置进度条
        this.progressDlgState = true; // 关闭进度条弹框
        const blob = new Blob([responseBlob], {'type': 'application/vnd.ms-excel'});
        const fileName = '用户信息.xls';
        if (window.navigator.msSaveOrOpenBlob) {
          navigator.msSaveBlob(blob, fileName); // For IE浏览器
        } else {
          const objectUrl = URL.createObjectURL(blob); // For 其他浏览器
          const a = document.createElement('a');
          document.body.appendChild(a);
          a.setAttribute('style', 'display:none');
          a.setAttribute('href', objectUrl);
          a.setAttribute('download', fileName);
          a.click();
          URL.revokeObjectURL(objectUrl);
        }
      });
    }
  }

  /**
   * 选择文件上传
   */
  onFileSelect(event): void {
    switch (event.length) {
      case 0:
        this.messagerService.alert({title: '温馨提示', msg: '请选择文件!', ok: '确定'});
        break;
      case 1:
        const file: File = event[0];
        const fileType = file.type;
        const fileSize = file.size;
        if (fileSize < (1024 * 1024 * 5) &&
          (fileType === 'application/vnd.ms-excel' || fileType === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')) {
          this.onCloseDlg(); // 关闭上传文件弹框
          this.progressDlgState = false; // 打开进度条弹框
          const progressSubscribe = interval(500).subscribe(() => {
            this.progressValue += Math.floor(Math.random() * 20);
            this.progressValue = this.progressValue > 100 ? 10 : this.progressValue;
          });
          const formData: FormData = new FormData();
          formData.append('file', file);
          this.service.import(formData).subscribe((responseJson) => {
            progressSubscribe.unsubscribe(); // 关闭进度条
            this.progressValue = 10; // 重置进度条
            this.progressDlgState = true; // 关闭进度条弹框
            switch (responseJson.code) {
              case 0:
                // 导入成功
                this.messagerService.alert({title: '温馨提示', msg: '导入成功!', ok: '确定'});
                this.onPageChange({pageNumber: this.pageNumber, pageSize: this.pageSize});
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
              default:
                // 系统错误
                this.messagerService.alert({title: '温馨提示', msg: '导入错误!', ok: '确定'});
                break;
            }
          });
        } else {
          this.messagerService.alert({title: '温馨提示', msg: '请检查文件格式、大小是否合法!', ok: '确定'});
        }
        break;
    }
    this.fileButtonComponent.clear(); // 清空选择的文件
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
    this.editDlgTitle = null;
    this.editRow = new User();
    this.editDlgState = true;
    this.deleteDlgTitle = null;
    this.selectedRow = [];
    this.deleteState = false;
    this.deleteDlgState = true;
    this.deleteDlgBtnState = false;
    this.upExcelDlgState = true;
    this.upExcelDlgTitle = null;
    this.itemForPage = {sex: '0'};
    this.formSubmitState = false;
    this.formValidStyle = true;
    this.levelOne = null;
    this.levelTwo = null;
    this.levelThree = null;
  }

  /**
   * 清空分页查询条件
   */
  onCleanSearch(): void {
    this.clean();
  }

  /**
   * 刷新数据
   */
  onReLoad(): void {
    this.clean();
    this.onPageChange({pageNumber: 1, pageSize: this.pageSize});
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
    } else {
      return {color: 'red'};
    }
  }

}
