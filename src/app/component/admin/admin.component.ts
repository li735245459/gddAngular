import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {Router} from '@angular/router';
import {User} from '../../globalModel/user';
import {menus} from '../../globalData/MenuData';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
  user: User = new User();
  title = 'GDD宠物馆';
  width = 250;
  collapsed = false;
  selectedMenu = null;
  menus = menus;

  constructor(private router: Router) {
  }

  ngOnInit() {
    this.user.name = sessionStorage.getItem('name');
    this.user.cover = sessionStorage.getItem('cover');
  }

  // 隐藏左侧菜单栏
  toggle() {
    this.collapsed = !this.collapsed;
    this.width = this.collapsed ? 50 : 250;
  }

  // 点击左侧菜单栏
  onItemClick(item) {
    this.selectedMenu = item;
    this.router.navigateByUrl(`admin/${item.link}`);
  }

  // 退出登陆
  onLogout(): void {
    sessionStorage.clear();
    this.router.navigateByUrl('login');
  }
}
