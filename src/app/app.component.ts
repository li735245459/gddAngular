import {Component} from '@angular/core';
import {Router} from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  menuText = '首页';

  constructor(public router: Router) {}

  /**
   * 菜单按钮事件
   * @param event
   */
  onMenu(event): void {
    this.menuText = event.target.text;
  }
}
