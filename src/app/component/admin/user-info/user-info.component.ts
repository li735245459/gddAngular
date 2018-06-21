import {Component, OnInit} from '@angular/core';
import {UserService} from '../../../service/user.service';
import {User} from '../../../model/user';

@Component({
  selector: 'app-user-info',
  templateUrl: './user-info.component.html',
  styleUrls: ['./user-info.component.css']
})
export class UserInfoComponent implements OnInit {
  msg = '查询成功';
  data; // 数据
  total; // 所有数据大小
  pageSize = 20; // 分页大小
  pageNumber = 1; // 当前分页
  pageOptions = { // 分页导航设置
    pageList: [20, 30, 40],
    displayMsg: '当前 {from} 到 {to} , 共 {total} 条',
    layout: ['list', 'sep', 'first', 'prev', 'next', 'last', 'sep', 'tpl', 'info'] // 报错
  };
  loading = true; // 添加表格加载状态
  loadMsg = '数据正在加载..';
  selectedRow; // 单击选中行,可以是多个
  editClosed = true; // 默认编辑数据弹框关闭
  editingRow: User = {}; // 正在编辑的行

  constructor(
    private userService: UserService) {
  }

  ngOnInit() {
    this.queryByPage();
  }

  /**
   * 分页查询
   */
  queryByPage() {
    this.userService.queryByPage().subscribe(responseJson => {
      if (responseJson.code === 0) {
        this.msg = '查询成功';
        this.data = responseJson.data;
        this.total = 100;
        this.loading = false;
      } else {
        this.msg = '查询失败';
      }
    });
  }

  /**
   * 分页插件回调事件
   * @param event
   */
  onPageChange(event) {
    this.pageNumber = event.pageNumber;
    this.pageSize = event.pageSize;
    this.queryByPage();
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
   * 取消已选择的行
   */
  onUnSelect(): void {
    this.selectedRow = null;
  }

  /**
   * 添加
   */
  onAdd(): void {
    this.editingRow = {};
    this.editClosed = false;
  }

  /**
   * 删除所有
   */
  onRemoveAll(): void {
    console.log('删除所有数据');
  }

  /**
   * 删除多行,包含一行
   */
  onRemoves(): void {
    if (this.selectedRow) {
      console.log(this.selectedRow.map(row => row.id).join(','));
    } else {
      console.log('请选中需要删除的数据');
    }
  }

  /**
   * 删除一行
   * @param row
   */
  onRemove(row): void {
    this.selectedRow = [row];
    this.onRemoves();
  }

  /**
   * 编辑
   * @param row
   */
  onEditRow(rowIndex): void {
    this.editingRow = this.data[rowIndex];
    this.editClosed = false;
  }

  /**
   * 刷新数据
   */
  onReLoad(): void {
    this.queryByPage();
  }

  /**
   * 关闭弹框
   */
  onEditClose(): void {
    this.editClosed = true;
    this.editingRow = {};
  }

}
