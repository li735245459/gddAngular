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
  width = 300;
  collapsed = false;
  selectedMenu = null;
  menus = [
    {
      text: 'Forms',
      iconCls: 'fa fa-wpforms',
      state: 'open',
      children: [{
        text: 'Form Element'
      }, {
        text: 'Wizard'
      }, {
        text: 'File Upload'
      }]
    }, {
      text: 'Mail',
      iconCls: 'fa fa-at',
      selected: true,
      children: [{
        text: 'Inbox'
      }, {
        text: 'Sent'
      }, {
        text: 'Trash',
        children: [{
          text: 'Item1'
        }, {
          text: 'Item2'
        }]
      }]
    }, {
      text: 'Layout',
      iconCls: 'fa fa-table',
      children: [{
        text: 'Panel'
      }, {
        text: 'Accordion'
      }, {
        text: 'Tabs'
      }]
    }];

  constructor(private router: Router) {
  }

  ngOnInit() {
  }

  toggle() {
    this.collapsed = !this.collapsed;
    this.width = this.collapsed ? 50 : 300;
  }

  onItemClick(item) {
    this.selectedMenu = item;
  }
}
