import {AfterViewInit, Component, OnInit, ViewEncapsulation} from '@angular/core';
import {UserService} from '../../../service/user.service';
import {User} from '../../../model/user';

@Component({
  selector: 'app-user-info',
  templateUrl: './user-info.component.html',
  styleUrls: ['./user-info.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class UserInfoComponent implements OnInit, AfterViewInit {
  title = '用户信息';
  msg = '查询成功'; // 全局提示消息
  deleteDlgState = true; // false删除弹框打开,true删除弹框关闭(默认)
  deleteDlgTitle; // 删除弹框标题
  deleteDlgBtnState = false; // 全局删除弹框状态,false表示可用(默认),true表示禁用
  deleteState = false; // 全局删除状态,false表示删除选择数据(默认),true表示删除所有数据
  //
  data = []; // 分页数据
  total = 0; // 所有数据条数
  pageNumber = 1; // 当前分页号
  pageSize = 20; // 默认分页大小
  pageOptions = { // 分页导航条参数设置
    pageList: [20, 30, 40],
    displayMsg: '当前 {from} 到 {to} , 共 {total} 条',
    layout: ['list', 'first', 'prev', 'next', 'last', 'info']
  };
  loading = true; // 开启datagrid加载提示
  loadMsg = '正在加载..';
  //
  selectedRow; // 选中的行(此处可多选,至少选中一行)
  editingRow: User = {}; // 正在编辑的行
  editClosed = true; // 添加、编辑弹框关闭
  editTitle; // 添加、编辑弹框标题
  // 分页查询条件对象
  user: User = {
    sex: ''
  };

  constructor(
    private userService: UserService) {
  }

  /**
   * 在第一轮 ngOnChanges 完成之后调用,此时所有输入属性都已经有了正确的初始绑定值
   */
  ngOnInit() {
    this.page();
  }

  ngAfterViewInit() {

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
    console.log(this.user);
    console.log(this.pageNumber);
    console.log(this.pageSize);
    this.userService.page(this.user, this.pageNumber, this.pageSize).subscribe(responseJson => {
      if (responseJson.code === 0) {
        this.msg = '查询成功';
        this.data = responseJson.data;
        // this.data = responseJson.data.list;
        // this.total = responseJson.data.total;
        this.loading = false;
      } else {
        this.msg = '查询失败';
      }
    });
  }

  /**
   * row 样式定义
   * @param row
   */
  setRowCss(row) {
    if (row.email === 'lisi13_java@163.com') {
      return {background: '#b8eecf', fontSize: '14px', fontStyle: 'italic'};
    }
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

  /**
   * 打开删除弹框
   */
  onOpenDeleteDlg(param): void {
    if (param === 'delete') {
      this.deleteState = false; // 删除所选
      this.deleteDlgTitle = '删除数据';
      if (this.selectedRow) {
        this.msg = '确定要删除所选数据,删除后将无法恢复!';
      } else {
        this.deleteDlgBtnState = true; // 禁用删除弹框(确认、取消)按钮
        this.msg = '请先选中需要删除的数据';
      }
    } else {
      this.deleteState = true; // 删除所有
      this.deleteDlgTitle = '清空数据';
      this.msg = '确定要删除所有数据,删除后将无法恢复！';
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
   * 刷新数据
   */
  onReLoad(): void {
    this.user = {};
    this.page();
  }

  /**
   * 清空分页查询条件
   */
  onCleanSearch(): void {
    this.user = {};
  }

  /**
   * 双击行-打开编辑框
   * @param event
   */
  onRowDblClick(event): void {
    this.editTitle = '编辑用户';
    this.editingRow = event;
    this.editClosed = false;
  }

  /**
   * 添加数据-打开编辑框
   */
  onAdd(): void {
    this.editTitle = '添加用户';
    this.editingRow = {};
    this.editClosed = false;
  }

  /**
   * 关闭添加、编辑弹框回调
   */
  onEditClose(): void {
    this.editingRow = {};
    this.editClosed = true;
  }
}
