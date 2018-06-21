import {Component, OnInit} from '@angular/core';
import {DataListComponent} from 'ng-easyui/components/datalist/datalist.component';
import {UserService} from '../../../service/user.service';


@Component({
  selector: 'app-user-info',
  templateUrl: './user-info.component.html',
  styleUrls: ['./user-info.component.css']
})
export class UserInfoComponent implements OnInit {
  msg = '查询成功';
  selectedRow; // 单击选中行,可以是多个
  data; // 数据
  total; // 所有数据大小
  pageSize = 20; // 分页大小
  pageNumber = 1; // 当前分页
  pageOptions = { // 分页导航设置
    pageList: [10, 20, 40],
    displayMsg: '当前 {from} 到 {to} , 共 {total} 条',
    layout: ['list', 'sep', 'first', 'prev', 'next', 'last', 'sep', 'tpl', 'info'] // 报错
  };
  loading = true;
  loadMsg = '数据正在加载..';

  constructor(
    private userService: UserService, private dataListComponent: DataListComponent) {
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
   * 取消选择
   */
  onRedo(): void {
    this.selectedRow = null;
  }

  /**
   * 删除
   */
  onRemove(): void {
    if (this.selectedRow) {
      console.log(this.selectedRow.map(row => row.id).join(','));
    } else {
      console.log('请选中需要删除的数据');
    }
  }

  /**
   * 清空所有
   */
  onRemoveAll(): void {
    console.log('删除所有数据');
  }

  /**
   * 添加
   */
  onAdd(): void {

  }

  /**
   * 刷新数据
   */
  onReLoad(): void {
    this.queryByPage();
  }

  /**
   * 右击row选中该行
   * @param event
   */
  onRowContextMenu(event): void {
    console.log(event.row);
    this.dataListComponent.selectRow(event.row);
  }
}
