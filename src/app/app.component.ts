import {Component} from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Tour of Heroes';
  menuText = '首页';

  onMenu(event): void {
    this.menuText = event.target.text;
  }
}
