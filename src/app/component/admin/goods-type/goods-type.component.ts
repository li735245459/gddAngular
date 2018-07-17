import {Component, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {MessagerService} from 'ng-easyui/components/messager/messager.service';
import {GoodsType} from '../../../globalModel/goodsType';
import {GoodsService} from '../../../service/goods.service';
import {TreeGridComponent} from 'ng-easyui/components/treegrid/treegrid.component';
import {TreeUtil} from '../../../globalUtil/treeUtil';

@Component({
  selector: 'app-goods-type',
  templateUrl: './goods-type.component.html',
  styleUrls: ['./goods-type.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class GoodsTypeComponent implements OnInit {
  msg: string = null; // 全局提示消息
  // 表格
  title = '商品类型信息';
  loading = true; // 开启grid加载提示
  loadMsg = '正在加载..';
  data = []; // 分页数据
  //
  @ViewChild(TreeGridComponent)
  private treeGridComponent: TreeGridComponent;
  //
  selectedRow = null; // 点击后选中的行,单条
  checkedRow = []; // 点击复选框选中的行,多条
  coverType: number;
  // 添加、编辑弹框
  editDlgTitle: String = null;
  editRow: GoodsType = {}; // 当前需要编辑的数据
  editDlgState = true; // true关闭弹框,false打开弹框
  // 删除弹框
  deleteDlgTitle: String = null;
  deleteDlgState = true; // true关闭弹框,false打开弹框
  deleteDlgBtnState = false; // true表示禁用,false表示可用
  // 表单
  itemForForm: FormGroup = null; // 表单对象
  formSubmitState = false; // true禁止表单提交,false启用表单提交
  formValidStyle = true; // true表单校验成功样式, false表单校验失败样式
  placeholder = { // 表单字段说明
    name: {'title': '商品类型名称', 'prompt': '(2~10位汉子)'}
  };

  constructor(
    private service: GoodsService,
    private formBuilder: FormBuilder,
    private messagerService: MessagerService,
    private router: Router) {
    // 创建表单对象
    this.createItemForForm(this.editRow);
  }

  ngOnInit() {
    this.find();
  }

  /**
   * 查询
   */
  find() {
    this.service.selectGoodsType().subscribe(responseJson => {
        switch (responseJson.code) {
          case 0:
            // 成功
            this.data = TreeUtil.prototype.getJsonForTreeGrid(responseJson.data);
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
      }
    );
  }

  /**
   * 点击删除按钮打开删除弹框
   */
  onOpenDeleteDlg(): void {
    this.checkedRow = this.treeGridComponent.getCheckedRows();
    if (this.checkedRow.length > 0) {
      this.msg = '确定要删除所选数据!';
    } else {
      this.msg = '请先选择数据';
      this.deleteDlgBtnState = true; // 禁用弹框(确认、取消)按钮
    }
    this.deleteDlgTitle = '删除数据'; // 设置弹框标题
    this.deleteDlgState = false; // 打开弹框
  }

  /**
   * 确认删除
   */
  onDeleteSure(): void {
    this.deleteDlgBtnState = true; // 禁用弹框(确认、取消)按钮
    const id = this.checkedRow.map(row => row.id).join(',');
    this.service.deleteGoodsType(id).subscribe(responseJson => {
      switch (responseJson.code) {
        case 0:
          // 成功
          this.deleteDlgBtnState = true; // 禁用弹框按钮
          this.msg = '删除成功！';
          setTimeout(() => {
            this.find();
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
        default:
          // 系统错误
          this.msg = '删除失败！';
          break;
      }
    });
    // }
  }

  /**
   * 取消删除
   */
  onDeleteCancel(): void {
    this.onCloseDlg(); // 关闭弹框
  }

  /**
   * 点击行
   * @param event
   */
  onRowClick(event) {
    this.selectedRow = event;
  }

  /**
   * 点击添加、编辑按钮打开弹框
   * @param param
   */
  onOpenEditDlg(param): void {
    if (param === 'add') {
      // 添加状态下---------------------------------------------------------->
      this.editDlgTitle = '添加商品类型信息';
      this.editRow = new GoodsType();
      this.createItemForForm(this.editRow); // 创建表单对象
      this.editDlgState = false; // 打开弹框
    } else {
      // 编辑状态下---------------------------------------------------------->
      if (this.selectedRow) {
        this.editDlgTitle = '编辑商品类型信息';
        this.editRow = this.selectedRow;
        this.createItemForForm(this.editRow); // 创建表单对象
        this.editDlgState = false; // 打开弹框
      } else {
        this.messagerService.alert({title: '温馨提示', msg: '您还没有选择数据!', ok: '确定'});
      }
    }
  }

  /**
   * 创建表单对象
   */
  createItemForForm(editRow): void {
    this.itemForForm = this.formBuilder.group({
      'name': [editRow.name, [Validators.required, Validators.pattern('^[\u4e00-\u9fa5_a-zA-Z0-9]{2,10}$')]]
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
      if (this.selectedRow) {
        // 添加子节点---->
        itemForForm.value.parentId = this.selectedRow.id;
        itemForForm.value.nodeLevel = this.selectedRow.nodeLevel + 1;
      } else {
        // 添加根节点---->
        itemForForm.value.parentId = 'root';
        itemForForm.value.nodeLevel = 0;
      }
    }
    this.service.modifyGoodsType(itemForForm.value).subscribe(responseJson => {
      switch (responseJson.code) {
        case 0:
          // 成功
          this.formSubmitState = true; // 禁用表单提交
          this.formValidStyle = true; // 设置全局消息样式为成功
          this.msg = '操作成功!';
          this.clean();
          setTimeout(() => {
            this.find();
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

  /**
   * 取消添加、编辑
   */
  onEditCancel(): void {
    this.onCloseDlg(); // 关闭弹框
  }

  /**
   * 关闭弹框
   */
  onCloseDlg(): void {
    this.clean(); // 重置全局变量
  }

  /**
   * 刷新数据
   */
  onReLoad(): void {
    this.find();
    this.clean();
  }

  /**
   * 重置全局参数
   */
  clean(): void {
    this.msg = null;
    this.editDlgTitle = null;
    this.editRow = {};
    this.editDlgState = true;
    this.deleteDlgTitle = null;
    this.treeGridComponent.unselectRow(this.selectedRow);
    this.selectedRow = null;
    this.checkedRow = [];
    this.deleteDlgState = true;
    this.deleteDlgBtnState = false;
    this.formSubmitState = false;
    this.formValidStyle = true;
  }

}
