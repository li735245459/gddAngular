import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {Router} from '@angular/router';
import {User} from '../../globalModel/user';
import {menus} from '../../globalData/MenuData';
import {AdminService} from '../../service/admin.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./admin.component.css'],
  providers: [AdminService]
})
export class AdminComponent implements OnInit {
  id: string = null;
  msg: string = null; // 全局提示消息
  adminTitle = 'GDD宠物馆'; // 后台首页标题
  width = 250; // 菜单栏宽度
  collapsed = false; // 默认菜单栏展开
  selectedMenu = null; // 当前选中的菜单栏
  menus = menus; // 菜单栏数据
  user: User = new User(); // 用户数据对象

  constructor(
    private router: Router,
    private adminService: AdminService) {
    // 订阅消息,组件交互测试
    adminService.adminTitleSubscription.subscribe(
      adminTitle => {
        this.adminTitle = adminTitle;
      });
    adminService.msgSubscription.subscribe(msg => {
        this.id = msg.id;
        this.msg = msg.id;
    });
  }

  ngOnInit() {
    this.user.name = sessionStorage.getItem('name'); // 用户名
    this.user.cover = sessionStorage.getItem('cover'); // 用户头像
  }


  // 隐藏、展开左侧菜单栏
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
