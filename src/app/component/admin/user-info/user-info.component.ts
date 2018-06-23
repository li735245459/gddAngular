import {AfterViewInit, Component, OnInit} from '@angular/core';
import {UserService} from '../../../service/user.service';
import {User} from '../../../model/user';

import {MessagerService} from 'ng-easyui/components/messager/messager.service';

@Component({
  selector: 'app-user-info',
  templateUrl: './user-info.component.html',
  styleUrls: ['./user-info.component.css']
})
export class UserInfoComponent implements OnInit, AfterViewInit {
  msg = '查询成功'; // 全局提示消息
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
  deleteClosed = true; // 删除提示弹框关闭
  editTitle; // 添加、编辑弹框标题
  deleteTitle; // 删除弹框标题
  // 分页查询条件对象
  user: User = {
    sex: ''
  };

  constructor(
    private userService: UserService, private messagerService: MessagerService) {
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
   * 清空数据
   */
  onClean(): void {
    this.deleteTitle = '清空数据';
    this.deleteClosed = false;
    this.msg = '确定要删除所有数据,删除后将无法恢复！';
  }

  /**
   * 清空分页查询条件
   */
  onCleanSearch(): void {
    this.user = {};
  }

  /**
   * 删除行数据(至少一行)
   */
  onDelete(): void {
    this.deleteTitle = '删除数据';
    this.deleteClosed = false;
    if (this.selectedRow) {
      console.log(this.selectedRow.map(row => row.id).join(','));
      this.msg = `确定删除: ${this.selectedRow.map(row => row.name).join(',')},删除后将无法恢复！`;
    } else {
      this.msg = '请选中需要删除的数据';
    }
  }

  /**
   * 刷新数据
   */
  onReLoad(): void {
    this.user = {};
    this.page();
  }

  /**
   * 取消已选择的行
   */
  onUnSelect(): void {
    this.selectedRow = null;
  }

  /**
   * 关闭添加、编辑弹框回调
   */
  onEditClose(): void {
    this.editingRow = {};
    this.editClosed = true;
  }

  /**
   * 关闭删除弹框回调
   */
  onDeleteClose(): void {
    this.onUnSelect();
    this.deleteClosed = true;
  }

}
