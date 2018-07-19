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
  // 表格
  title = '封面信息';
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
  itemForPage: Cover = {};
  // 添加、编辑弹框
  editDlgTitle: String = null;
  editRow: Cover = new Cover(); // 当前需要编辑的数据
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
    name: {'title': '封面名称', 'prompt': '(2~20位有效字符)'},
    introduce: {'title': '封面说明', 'prompt': '(0~50位有效字符)'},
    href: {'title': '外链地址', 'prompt': '(0~100位有效字符)'},
    src: {'title': '下载地址', 'prompt': '(1~500位有效字符)'}
  };
  // 封面类型comboTree
  coverTypeData = [];
  coverTypeName = null;
  // 上传文件
  files: FileList = null;
  fileSizeIllegal = false;
  fileUrls = [];

  constructor(
    private service: CoverService,
    private formBuilder: FormBuilder,
    private messagerService: MessagerService,
    private router: Router,
    private sanitizer: DomSanitizer) {
    // 创建表单对象
    this.createItemForForm();
  }

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
    this.service.pageCover(this.itemForPage, this.pageNumber, this.pageSize).subscribe(responseJson => {
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
    this.service.deleteCover(id).subscribe(responseJson => {
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
      this.editDlgTitle = '添加封面信息';
    } else {
      // 编辑状态下---------------------------------------------------------->
      this.editDlgTitle = '编辑封面信息';
      this.editRow = param;
    }
    /*加载封面类型信息初始化comboTree*/
    this.service.selectCoverType().subscribe(responseJson => {
      switch (responseJson.code) {
        case 0:
          // 成功
          this.coverTypeData = TreeUtil.prototype.getJsonForTree(responseJson.data);
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
    });
    this.createItemForForm(); // 创建表单对象
    this.editDlgState = false; // 打开弹框
  }

  /**
   * 创建表单对象
   */
  createItemForForm(): void {
    this.itemForForm = this.formBuilder.group({
      // 'file': [this.editRow.covertTypeName]
    });
    /*动态添加表单对象属性*/
    if (this.editRow && this.editRow.id) {
      // 编辑状态下---------------------------------------------------------->
      this.itemForForm.addControl('isActive',
        new FormControl(this.editRow.isActive, [Validators.required, Validators.pattern('^[0|1].*$')])); // 添加isActive属性对象
      this.itemForForm.addControl('name',
        new FormControl(this.editRow.name, [Validators.required, Validators.pattern('^[\u4e00-\u9fa5_a-zA-Z0-9]{2,20}$')])); // 添加name属性对象
      this.itemForForm.addControl('href',
        new FormControl(this.editRow.href, [Validators.pattern('^.{0,100}$')])); // 添加href属性对象
      this.itemForForm.addControl('introduce',
        new FormControl(this.editRow.src, [Validators.pattern('^.{0,50}$')])); // 添加introduce属性对象
      this.itemForForm.addControl('src', new FormControl(this.editRow.src)); // 添加src属性对象
    } else {
      // 添加状态下---------------------------------------------------------->
      // this.itemForForm.addControl('files', new FormControl(null)); // 添加files属性对象
    }
    // console.log(this.itemForForm.value);
  }

  /**
   * 选择本地文件
   * @param event
   */
  onChangeSelectImg(event) {
    this.files = null; // 清空已选择的文件
    this.fileUrls = []; // 清空已选择的文件地址
    this.files = event.target.files; // 获取选择的文件
    for (const file of event.target.files) {
      this.fileUrls.push(this.sanitizer.bypassSecurityTrustUrl(window.URL.createObjectURL(file)));
      if (file.size > 1024 * 1024 * 1) {
        this.fileSizeIllegal = true;
      }
    }
  }

  /**
   * 保存添加、编辑-提交表单
   */
  onSubmitForm(itemForForm): void {
    if (this.editRow && this.editRow.id) {
      // 编辑状态下---------------------------------------------------------->
    } else {
      // 添加状态下---------------------------------------------------------->
      const formData: FormData = new FormData();
      for (let index = 0; index < this.files.length; index++) {
        const file = this.files.item(index);
        /*set和append的区别在于,如果键已经存在set会使用新值覆盖已有的值而append会把新值添加到已有值集合的后面*/
        formData.append('files', file); // 设置上传文件
      }
      formData.set('coverTypeName', this.coverTypeName); // 设置封面类型名称
      this.service.insertCover(formData).subscribe(responseJson => {
        switch (responseJson.code) {
          case 0:
            // 成功
            this.formSubmitState = true; // 禁用表单提交
            this.formValidStyle = true; // 设置全局消息样式为成功
            this.msg = '添加成功!';
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
            // 系统错误
            this.formSubmitState = false; // 激活表单提交按钮
            this.formValidStyle = false; // 设置全局消息样式为失败
            this.msg = responseJson.msg;
            break;
        }
      });
    }
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
    this.editDlgTitle = null;
    this.editRow = new Cover();
    this.editDlgState = true;
    this.deleteDlgTitle = null;
    this.selectedRow = [];
    this.deleteState = false;
    this.deleteDlgState = true;
    this.deleteDlgBtnState = false;
    this.itemForPage = {};
    this.formSubmitState = false;
    this.formValidStyle = true;
    this.coverTypeName = null;
    this.files = null;
    this.fileSizeIllegal = false;
    this.fileUrls = [];
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
  setIsActiveCellCss(row, value) {
    if (value === 1) {
      return {color: 'blue'};
    } else {
      return {color: 'red'};
    }
  }
}
