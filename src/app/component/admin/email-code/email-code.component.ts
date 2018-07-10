import {AfterViewInit, Component, OnInit} from '@angular/core';
import {EmailCode} from '../../../globalModel/emailCode';
import {EmailCodeService} from '../../../service/email-code.service';

@Component({
  selector: 'app-email-code',
  templateUrl: './email-code.component.html',
  styleUrls: ['./email-code.component.css']
})
export class EmailCodeComponent implements OnInit, AfterViewInit {
  msg: string = null; // 全局提示消息
  // 表格
  title = '邮件信息';
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
  // 分页查询条件对象
  itemForPage: EmailCode = {};
  // 删除弹框
  deleteDlgTitle: String = null;
  selectedRow = []; // 当前选中的数据
  deleteState = false; // true删除所有数据,false删除当前选中的数据
  deleteDlgState = true; // true关闭弹框,false打开弹框
  deleteDlgBtnState = false; // true表示禁用,false表示可用

  constructor(private emailCodeService: EmailCodeService) {
  }

  ngOnInit() {
  }

  /**
   * 分页查询
   */
  page() {
    this.emailCodeService.page(this.itemForPage, this.pageNumber, this.pageSize).subscribe(responseJson => {
      if (responseJson.code === 0) {
        this.msg = '查询成功';
        this.data = responseJson.data.list;
        this.total = responseJson.data.total;
        this.loading = false;
      } else {
        this.msg = '查询失败';
      }
    });
  }

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
   * 打开删除弹框
   */
  onOpenDeleteDlg(param): void {
    if (param === 'delete') {
      // 删除所选
      this.deleteState = false;
      this.deleteDlgTitle = '删除数据';
      if (this.selectedRow.length > 0) {
        this.msg = '确定要删除所选数据!';
      } else {
        // 禁用删除弹框(确认、取消)按钮
        this.deleteDlgBtnState = true;
        this.msg = '请先选中需要删除的数据';
      }
    } else {
      // 删除所有
      this.deleteState = true;
      this.deleteDlgTitle = '清空数据';
      this.msg = '确定要删除所有数据!';
    }
    // 打开删除弹框
    this.deleteDlgState = false;
  }

  /**
   * 确认删除
   */
  onDeleteSure(): void {
    this.deleteDlgBtnState = true; // 禁用删除弹框按钮
    let id = null;
    if (this.deleteState) {
      // 删除所有
      id = 'all';
    } else {
      // 删除所选
      if (this.selectedRow) {
        id = this.selectedRow.map(row => row.id).join(',');
      } else {
        id = null;
      }
    }
    if (id) {
      this.emailCodeService.delete(id).subscribe(responseObj => {
        if (responseObj.code === 0) {
          this.deleteDlgBtnState = true;
          this.msg = '删除成功！';
          setTimeout(() => {
            // 刷新数据
            this.onPageChange({pageNumber: this.pageNumber, pageSize: this.pageSize});
            // 关闭删除弹框
            this.deleteDlgState = true;
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
    this.onCloseDlg();
  }

  /**
   * 取消已选择数据
   */
  onUnSelect(): void {
    this.selectedRow = null;
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
    this.deleteDlgTitle = null;
    this.selectedRow = [];
    this.deleteState = false;
    this.deleteDlgState = true;
    this.deleteDlgBtnState = false;
  }

}
