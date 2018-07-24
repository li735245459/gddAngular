import {Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {MessagerService} from 'ng-easyui/components/messager/messager.service';
import {CoverType} from '../../../globalModel/CoverType';
import {CoverService} from '../../../service/cover.service';
import {TreeGridComponent} from 'ng-easyui/components/treegrid/treegrid.component';
import {TreeUtil} from '../../../globalUtil/treeUtil';
import {AdminService} from '../../../service/admin.service';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-cover-type',
  templateUrl: './cover-type.component.html',
  styleUrls: ['./cover-type.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class CoverTypeComponent implements OnInit, OnDestroy {
  msg: String = null; // 全局提示消息
  title = '封面类型信息'; // 组建标题
  adminSelectedMenuSubscription: Subscription = null; // 父子组将通讯的订阅对象
  // eui-treegrid（数据表格）
  data = [];
  loading = true; // 开启加载提示
  loadMsg = '正在加载..';
  @ViewChild(TreeGridComponent)
  private treeGridComponent: TreeGridComponent;
  selectRow = null; // 点击某一行后选中的行（对象）
  checkRow = []; // 点击复选框后选中的行
  editRow: CoverType = new CoverType(); // 存储当前正在编辑的数据
  // eui-dialog（添加、编辑）
  editDlgTitle = '添加、编辑封面类型信息';
  editDlgClosed = true; // 默认关闭弹框,false打开弹框
  // eui-dialog（删除）
  deleteDlgTitle = '删除封面类型信息'; // 弹框标题
  deleteDlgClosed = true; // 默认关闭弹框,false打开弹框
  deleteDlgBtnDisabled = false; // 默认禁用(确认、取消)按钮,false表示激活(确认、取消)按钮
  // 表单
  itemForForm: FormGroup = null; // 表单对象
  formBtnDisabled = false; // 默认激活表单提交,true禁用表单提交
  formValidSuccess = true; // true表单校验成功, false表单校验失败
  placeholder = {name: {'title': '封面类型名称', 'prompt': '(2~10位汉子)'}};

  /**
   * 构造函数
   */
  constructor(
    private service: CoverService,
    private formBuilder: FormBuilder,
    private messagerService: MessagerService,
    private router: Router,
    private adminService: AdminService) {
    this.createItemForForm(); // 创建表单对象
  }

  /**
   * 初始化函数
   */
  ngOnInit() {
    this.selectCoverType(); // 查询封面类型
    this.adminService.pushAdminSelectedMenu({ // 发布订阅
      iconCls: 'sidemenu-default-icon',
      link: 'coverType',
      parent: null,
      text: '封面分类'
    });
  }

  /**
   * 组建销毁
   */
  ngOnDestroy() {
    if (this.adminSelectedMenuSubscription) { // 取消订阅,防止内存泄漏
      this.adminSelectedMenuSubscription.unsubscribe();
    }
  }

  /**
   * 获取封面类型信息
   */
  selectCoverType() {
    this.service.selectCoverType().subscribe(responseJson => {
        this.loading = false; // 关闭加载提示
        switch (responseJson.code) {
          case 0: // 成功
            this.data = TreeUtil.prototype.getTreeGridData(responseJson.data);
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
          default: // 其他错误
            this.messagerService.alert({title: '温馨提示', msg: '系统错误!', ok: '确定'});
            break;
        }
      }
    );
  }

  /**
   * 打开删除弹框
   */
  onOpenDeleteDlg(): void {
    this.checkRow = this.treeGridComponent.getCheckedRows(); // 获取checked的数据(数组类型)
    if (this.checkRow.length > 0) {
      this.msg = '确定要删除所选数据!';
    } else {
      this.msg = '请先选择数据';
      this.deleteDlgBtnDisabled = true; // 禁用弹框(确认、取消)按钮
    }
    this.deleteDlgClosed = false; // 打开弹框
  }

  /**
   * 确认删除
   */
  onDeleteSure(): void {
    this.deleteDlgBtnDisabled = true; // 禁用弹框(确认、取消)按钮
    const id = this.checkRow.map(row => row.id).join(','); // 过滤数组中的id并转化成以,号分割的字符串
    this.service.deleteCoverType(id).subscribe(responseJson => {
      switch (responseJson.code) {
        case 0: // 成功
          this.deleteDlgBtnDisabled = true; // 禁用弹框按钮
          this.msg = '删除成功！';
          setTimeout(() => {
            this.selectCoverType();
            this.deleteDlgClosed = true; // 关闭弹框
          }, 500);
          break;
        case 1000: // jwt非法
          this.msg = '登录超时！';
          setTimeout(() => {
            this.router.navigateByUrl('/login');
          }, 500);
          break;
        default: // 其它错误
          this.msg = '删除失败！';
          break;
      }
    });
  }

  /**
   * 点击添加、编辑按钮打开弹框
   * @param param
   */
  onOpenEditDlg(param): void {
    if (param === 'add') {
      // 添加状态下---------------------------------------------------------->
      this.editDlgTitle = '添加封面类型信息';
      this.createItemForForm(); // 创建表单对象
      this.editDlgClosed = false; // 打开弹框
    } else {
      // 编辑状态下---------------------------------------------------------->
      if (this.selectRow) {
        this.editDlgTitle = '编辑封面类型信息';
        this.editRow = this.selectRow;
        this.createItemForForm(); // 创建表单对象
        this.editDlgClosed = false; // 打开弹框
      } else {
        this.messagerService.alert({title: '温馨提示', msg: '您还没有选择数据!', ok: '确定'});
      }
    }
  }

  /**
   * 创建表单对象
   */
  createItemForForm(): void {
    this.itemForForm = this.formBuilder.group({
      'name': [this.editRow.name, [Validators.required, Validators.pattern('^[\u4e00-\u9fa5_a-zA-Z0-9]{2,20}$')]]
    });
  }

  /**
   * 保存添加、编辑-提交表单
   */
  onSubmitForm(itemForForm): void {
    if (this.editRow && this.editRow.id) {
      // 编辑状态下---------------------------------------------------------->
      itemForForm.value.id = this.editRow.id; // 设置ID作为后台修改的凭证
    } else {
      // 添加状态下---------------------------------------------------------->
      if (this.selectRow) {
        // 添加子节点---->
        itemForForm.value.parentId = this.selectRow.id;
        itemForForm.value.nodeLevel = this.selectRow.nodeLevel + 1;
      } else {
        // 添加根节点---->
        itemForForm.value.parentId = 'root';
        itemForForm.value.nodeLevel = 0;
      }
    }
    this.service.modifyCoverType(itemForForm.value).subscribe(responseJson => {
      switch (responseJson.code) {
        case 0: // 成功
          this.formBtnDisabled = true; // 禁用表单提交
          this.formValidSuccess = true; // 设置全局消息样式为成功
          this.msg = '操作成功!';
          this.clean();
          setTimeout(() => {
            this.selectCoverType();
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

  /**
   * 刷新数据
   */
  onReLoad(): void {
    this.clean();
    this.selectCoverType();
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
    this.editDlgTitle = '添加、编辑封面类型信息';
    this.editRow = new CoverType();
    this.editDlgClosed = true;
    this.deleteDlgTitle = '删除封面类型信息';
    this.treeGridComponent.unselectRow(this.selectRow);
    this.selectRow = null;
    this.treeGridComponent.uncheckAllRows();
    this.checkRow = [];
    this.deleteDlgClosed = true;
    this.deleteDlgBtnDisabled = false;
    this.formBtnDisabled = false;
    this.formValidSuccess = true;
  }

}

