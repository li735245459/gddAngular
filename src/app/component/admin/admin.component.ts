import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {Router} from '@angular/router';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
  title = 'GDD宠物馆';
  width = 250;
  collapsed = false;
  selectedMenu = null;
  menus = [
    {
      text: '用户管理',
      iconCls: 'fa fa-user-o',
      state: 'open',
      children: [{
        text: '用户信息',
        link: 'user'
        // children: [{
        //   text: '基本信息',
        //   selected: true,
        //   link: 'user'
        // }]
      }]
    }, {
      text: '图片管理',
      iconCls: 'fa fa-file-picture-o',
      children: [{
        text: '图片分类'
      }, {
        text: '图片信息'
      }]
    }, {
      text: '商品管理',
      iconCls: 'fa fa-shopping-bag',
      children: [{
        text: '商品分类'
      }, {
        text: '商品信息'
      }]
    }, {
      text: '销售管理',
      iconCls: 'fa fa-pie-chart',
      children: [{
        text: '销售记录'
      }, {
        text: '销售统计'
      }]
    }];

  constructor(private router: Router) {
  }

  ngOnInit() {
  }

  // 隐藏左侧菜单栏
  toggle() {
    this.collapsed = !this.collapsed;
    this.width = this.collapsed ? 50 : 250;
  }

  // 点击左侧菜单栏
  onItemClick(item) {
    this.selectedMenu = item;
    // console.log(item);
    this.router.navigateByUrl(`admin/${item.link}`);
  }

  // 退出登陆
  onLogout(): void {
    sessionStorage.clear();
    this.router.navigateByUrl('login');
  }
}
