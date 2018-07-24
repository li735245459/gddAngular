import {AfterViewInit, Component, OnInit, ViewEncapsulation} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {DomSanitizer} from '@angular/platform-browser';

import {Cover} from '../../../globalModel/Cover';
import {CoverService} from '../../../service/cover.service';
import {MessagerService} from 'ng-easyui/components/messager/messager.service';
import {Router} from '@angular/router';
import {TreeUtil} from '../../../globalUtil/treeUtil';

@Component({
  selector: 'app-cover',
  templateUrl: './cover.component.html',
  styleUrls: ['./cover.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class CoverComponent implements OnInit, AfterViewInit {
  msg: string = null; // 全局提示消息
  title = '封面信息'; // 组建标题
  // eui-datagrid（数据表格）
  loading = true; // 开启加载提示
  loadMsg = '正在加载..';
  data = []; // 表格数据
  total = 0;
  pageNumber = 1;
  pageSize = 20;
  pageOptions = {
    pageList: [10, 20, 30, 40, 50],
    displayMsg: '当前 {from} 到 {to} , 共 {total} 条',
    layout: ['list', 'sep', 'first', 'prev', 'sep', 'tpl', 'sep', 'next', 'last', 'sep', 'refresh', 'sep', 'links', 'info']
  };
  selectRow = []; // 存储点击某一行后选中的行（数组）
  itemForPage: Cover = {}; // 分页查询条件参数（双向数据绑定）
  // eui-dialog（添加、编辑）
  editDlgTitle = '添加、编辑封面信息';
  editDlgClosed = true; // 默认关闭弹框,false打开弹框
  editRow: Cover = new Cover(); // 存储当前正在编辑的数据
  coverTypeData = []; // 封面类型数据
  coverTypeName = null; // 存储选择的封面类型名称（双向数据绑定）
  formData: FormData = new FormData(); // 存储上传的文件和封面类型名称
  fileUrls = []; // 上传文件的url地址,用于回显
  filesLength = 0; // 上传文件的个数,至少一个
  // eui-dialog（删除）
  deleteDlgTitle = '删除封面信息';
  deleteDlgClosed = true; // 默认关闭弹框,false打开弹框
  deleteDlgBtnDisabled = false; // 默认禁用(确认、取消)按钮,false表示激活(确认、取消)按钮
  deleteState = false; // 默认删除当前选中的数据,true删除所有数据
  // 表单
  itemForForm: FormGroup = null; // 表单对象
  formBtnDisabled = false; // 默认激活表单提交,true禁用表单提交
  formValidSuccess = true; // true表单校验成功, false表单校验失败
  placeholder = {
    name: {'title': '封面名称', 'prompt': '(2~20位有效字符)'},
    introduce: {'title': '封面说明', 'prompt': '(0~50位有效字符)'},
    href: {'title': '外链地址', 'prompt': '(以http://开头)'},
    src: {'title': '下载地址', 'prompt': '(1~500位有效字符)'}
  };

  /**
   * 构造函数
   */
  constructor(
    private service: CoverService,
    private formBuilder: FormBuilder,
    private messagerService: MessagerService,
    private router: Router,
    private sanitizer: DomSanitizer) {
    this.createItemForForm(); // 创建表单对象
  }

  /**
   * 初始化函数
   */
  ngOnInit() {
  }

  /**
   * 在组件相应的视图初始化之后调用
   */
  ngAfterViewInit() {
    this.onPageChange({pageNumber: 1, pageSize: this.pageSize}); // 分页查询封面信息（首次加载,itemForPage为空）
  }

  /**
   * 筛选
   */
  onScreening(): void {
    this.onPageChange({pageNumber: 1, pageSize: this.pageSize}); // 分页查询封面信息（itemForPage不为空）
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
    this.service.pageCover(this.itemForPage, this.pageNumber, this.pageSize).subscribe(responseJson => {
      this.loading = false; // 关闭加载提示
      switch (responseJson.code) {
        case 0: // 成功
          this.data = responseJson.data.list;
          this.total = responseJson.data.total;
          break;
        case 1000: // jwt非法
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
        default: // 系统错误
          this.messagerService.alert({title: '温馨提示', msg: '系统错误!', ok: '确定'});
          break;
      }
    });
  }

  /**
   * 打开删除弹框
   */
  onOpenDeleteDlg(param): void {
    if (param === 'deleteMore') {
      // 删除所选---------------------------------------------------------->
      this.deleteState = false; // 删除所选
      if (this.selectRow.length > 0) {
        this.msg = '确定要删除所选数据!';
      } else {
        this.deleteDlgBtnDisabled = true; // 禁用弹框(确认、取消)按钮
        this.msg = '请先选中需要删除的数据';
      }
    } else {
      // 删除所有---------------------------------------------------------->
      this.deleteState = true; // 删除所有
      this.msg = '确定要删除所有数据!';
    }
    this.deleteDlgClosed = false; // 打开弹框
  }

  /**
   * 确认删除
   */
  onDeleteSure(): void {
    this.deleteDlgBtnDisabled = true; // 禁用删除弹框按钮
    let id = null;
    if (this.deleteState) {
      // ----------------删除所有
      id = 'all';
    } else {
      // ----------------删除所选
      id = this.selectRow.map(row => row.id).join(',');
    }
    this.service.deleteCover(id).subscribe(responseJson => {
      switch (responseJson.code) {
        case 0:
          // 成功
          this.deleteDlgBtnDisabled = true; // 禁用弹框按钮
          this.msg = '删除成功！';
          setTimeout(() => {
            this.onPageChange({pageNumber: this.pageNumber, pageSize: this.pageSize}); // 重置当前页数据
            this.deleteDlgClosed = true; // 关闭弹框
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
   * 点击添加按钮打开添加弹框
   * 双击行打开编辑弹框
   * @param param
   */
  onOpenEditDlg(param): void {
    this.selectRow = []; // 取消当前选中的所有行
    if (param === 'add') {
      // 添加状态下---------------------------------------------------------->
      this.editDlgTitle = '添加封面信息';
    } else {
      // 编辑状态下---------------------------------------------------------->
      this.editDlgTitle = '编辑封面信息';
      this.editRow = param;
      this.coverTypeName = param.coverTypeName; // 封面类型赋值回显
    }
    this.service.selectCoverType().subscribe(responseJson => { // 加载封面类型信息初始化comboTree
      switch (responseJson.code) {
        case 0: // 成功
          this.coverTypeData = TreeUtil.prototype.getTreeData(responseJson.data); // comboTree赋值
          break;
        case 1000: // jwt非法
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
        default: // 系统错误
          this.messagerService.alert({title: '温馨提示', msg: '系统错误!', ok: '确定'});
          break;
      }
    });
    this.createItemForForm(); // 创建表单对象
    this.editDlgClosed = false; // 打开弹框
  }

  /**
   * 创建表单对象
   */
  createItemForForm(): void {
    this.itemForForm = this.formBuilder.group({});
    /*动态添加表单对象属性*/
    if (this.editRow && this.editRow.id) {
      // 编辑状态下---------------------------------------------------------->
      this.itemForForm.addControl('isActive',
        new FormControl(this.editRow.isActive, [Validators.pattern('^["激活"|"屏蔽"].*$')]));
      this.itemForForm.addControl('name',
        new FormControl(this.editRow.name, [Validators.required, Validators.pattern('^[\u4e00-\u9fa5_a-zA-Z0-9]{1,20}$')]));
      this.itemForForm.addControl('href',
        new FormControl(this.editRow.href, [Validators.pattern('^http://$')]));
      this.itemForForm.addControl('introduce',
        new FormControl(this.editRow.introduce, [Validators.pattern('^.{0,50}$')]));
      this.itemForForm.addControl('src',
        new FormControl({value: this.editRow.src, disabled: true}));
    } else {
      // 添加状态下---------------------------------------------------------->
    }
    // console.log(this.itemForForm);
  }

  /**
   * 选择文件
   * @param event
   */
  onChangeSelectImg(event) {
    this.formData = new FormData();
    this.fileUrls = [];
    const files: FileList = event.target.files; // 上传的文件
    this.filesLength = files.length; // 上传文件的个数,至少为1个文件
    for (let index = 0; index < this.filesLength; index++) {
      const file = files.item(index);
      const fileType = file.type;
      if (fileType !== 'image/jpeg') {
        this.messagerService.alert({title: '温馨提示', msg: '请选择格式为jpg类型的图片文件', ok: '确定'});
        event.currentTarget.value = null; // 清空选择的文件
        return;
      }
      const fileSize = file.size;
      if (fileSize > 1 * 1024 * 1024) {
        this.messagerService.alert({title: '温馨提示', msg: '请选择大小在1M以内的图片文件', ok: '确定'});
        event.currentTarget.value = null; // 清空选择的文件
        return;
      }
      /*set和append的区别在于,如果键已经存在set会使用新值覆盖已有的值而append会把新值添加到已有值集合的后面*/
      this.formData.append('files', file); // 追加上传的文件
      this.fileUrls.push(this.sanitizer.bypassSecurityTrustUrl(window.URL.createObjectURL(file))); // 获取上传文件的地址
    }
  }

  /**
   * 保存添加、编辑-提交表单
   */
  onSubmitForm(itemForForm): void {
    if (this.editRow && this.editRow.id) {
      // 编辑状态下---------------------------------------------------------->
      itemForForm.value.id = this.editRow.id; // 设置ID作为后台修改的凭证
      itemForForm.value.coverTypeName = this.coverTypeName; // // 设置封面类型名称
      if (itemForForm.value.name === this.editRow.name) { // 如果封面名称没有修改则需要设置为空
        itemForForm.value.name = null;
      }
      this.service.modifyCover(itemForForm.value).subscribe(responseJson => {
        switch (responseJson.code) {
          case 0: // 成功
            this.formBtnDisabled = true; // 禁用表单提交
            this.formValidSuccess = true; // 设置全局消息样式为成功
            this.msg = '添加成功!';
            setTimeout(() => {
              this.onPageChange({pageNumber: this.pageNumber, pageSize: this.pageSize}); // 重置当前页数据
              this.editDlgClosed = true; // 关闭弹框
            }, 500);
            break;
          case 1000: // jwt非法
            this.msg = '登录超时！';
            setTimeout(() => {
              this.router.navigateByUrl('/login');
            }, 500);
            break;
          default: // 系统错误
            this.formBtnDisabled = false; // 激活表单提交按钮
            this.formValidSuccess = false; // 设置全局消息样式为失败
            this.msg = responseJson.msg;
            break;
        }
      });
    } else {
      // 添加状态下---------------------------------------------------------->
      this.formData.set('coverTypeName', this.coverTypeName); // 设置封面类型名称
      this.service.importCover(this.formData).subscribe(responseJson => {
        switch (responseJson.code) {
          case 0: // 成功
            this.formBtnDisabled = true; // 禁用表单提交
            this.formValidSuccess = true; // 设置全局消息样式为成功
            this.msg = '添加成功!';
            setTimeout(() => {
              this.onPageChange({pageNumber: this.pageNumber, pageSize: this.pageSize}); // 重置当前页数据
              this.editDlgClosed = true; // 关闭弹框
            }, 500);
            break;
          case 1000: // jwt非法
            this.msg = '登录超时！';
            setTimeout(() => {
              this.router.navigateByUrl('/login');
            }, 500);
            break;
          default: // 系统错误
            this.formBtnDisabled = false; // 激活表单提交按钮
            this.formValidSuccess = false; // 设置全局消息样式为失败
            this.msg = responseJson.msg;
            break;
        }
      });
    }
  }

  /**
   * 刷新数据
   */
  onReLoad(): void {
    this.clean();
    this.onPageChange({pageNumber: 1, pageSize: this.pageSize});
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
   * 清空筛选条件
   */
  onCleanScreening(): void {
    this.clean();
  }

  /**
   * 重置全局参数
   */
  clean(): void {
    this.msg = null;
    this.editDlgTitle = '添加、编辑封面信息';
    this.editRow = new Cover();
    this.editDlgClosed = true;
    this.deleteDlgTitle = '删除封面信息';
    this.selectRow = [];
    this.deleteState = false;
    this.deleteDlgClosed = true;
    this.deleteDlgBtnDisabled = false;
    this.itemForPage = {};
    this.formBtnDisabled = false;
    this.formValidSuccess = true;
    this.coverTypeName = null;
    this.fileUrls = [];
    this.formData = new FormData();
    this.filesLength = 0;
    /*清空选择的文件*/
    if (document.getElementById('files')) {
      document.getElementById('files').setAttribute('type', 'text');
      document.getElementById('files').setAttribute('type', 'file');
    }
  }

  /**
   * 样式定义
   */
  setIsActiveCellCss(row, value) {
    if (value === '屏蔽') {
      return {color: 'red'};
    }
  }
}
