import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {Router} from '@angular/router';
import {User} from '../../globalModel/User';
import {AdminService} from '../../service/admin.service';
import {menus} from '../../globalModel/JsonLocalData';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./admin.component.css'],
  providers: [AdminService]
})
export class AdminComponent implements OnInit {
  // id: string = null;
  msg: string = null; // 全局提示消息
  width = 250; // 菜单栏宽度
  collapsed = false; // 默认展开菜单栏
  selectedMenu = null; // 当前操作的菜单栏
  menus = menus; // 菜单栏数据
  user: User = new User(); // 用户数据对象

  /**/
  constructor(
    private router: Router,
    private service: AdminService) {
    service.adminSelectedMenuSubscription.subscribe( // 订阅消息
      selectedMenu => {
        console.log('订阅消息-admin');
        console.log(selectedMenu);
        this.selectedMenu = selectedMenu;
      });
  }

  /**/
  ngOnInit() {
    this.user.name = sessionStorage.getItem('name'); // 用户名
    this.user.cover = sessionStorage.getItem('cover'); // 用户头像
  }


  /**
   * 隐藏、展开左侧菜单栏
   */
  toggle() {
    this.collapsed = !this.collapsed;
    this.width = this.collapsed ? 50 : 250;
  }

  /**
   * 点击左侧菜单栏
   * @param item
   */
  onItemClick(item) {
    // console.log('onItemClick');
    // console.log(item);
    this.selectedMenu = item; // 当前选中的菜单栏
    this.router.navigateByUrl(`admin/${item.link}`);
  }

  /**
   * 退出登陆
   */
  onLogout(): void {
    sessionStorage.clear();
    this.router.navigateByUrl('login');
  }
}
