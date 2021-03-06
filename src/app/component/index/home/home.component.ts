import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-index',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  menuText = '首页';
  hotPets = [
    {
      name: '德国边牧',
      introduce: '边境牧羊犬原产于苏格兰边境',
      img: '../../../assets/img/goods/h5.jpg',
      link: 'https://baike.baidu.com/item/%E6%B3%95%E5%9B%BD%E6%96%97%E7%89%9B%E7%8A%AC'
    },
    {
      name: '法国斗牛士',
      introduce: '边境牧羊犬原产于苏格兰边境，为柯利牧羊犬的一种',
      img: '../../../assets/img/goods/h6.jpg',
      link: 'https://baike.baidu.com/item/%E6%B3%95%E5%9B%BD%E6%96%97%E7%89%9B%E7%8A%AC'
    },
    {
      name: '法国斗牛士',
      introduce: '边境牧羊犬原产于苏格兰边境，为柯利牧羊犬的一种',
      img: '../../../assets/img/goods/h7.jpg',
      link: 'https://baike.baidu.com/item/%E6%B3%95%E5%9B%BD%E6%96%97%E7%89%9B%E7%8A%AC'
    },
    {
      name: '德国牧羊',
      introduce: '边境牧羊犬原产于苏格兰边境，为柯利牧羊犬的一种，具有强烈的牧羊本能，',
      img: '../../../assets/img/goods/h8.jpg',
      link: 'https://baike.baidu.com/item/%E6%B3%95%E5%9B%BD%E6%96%97%E7%89%9B%E7%8A%AC'
    }
  ];
  banners = [
    {name: '导航图片1', introduce: 'This carousel uses customized default values.', img: '../../../assets/img/banner/h1.jpg'},
    {name: '导航图片2', introduce: 'This carousel uses customized default values.', img: '../../../assets/img/banner/h2.jpg'},
    {name: '导航图片3', introduce: 'This carousel uses customized default values.', img: '../../../assets/img/banner/h3.jpg'},
    {name: '导航图片4', introduce: 'This carousel uses customized default values.', img: '../../../assets/img/banner/h4.jpg'}
  ];
  service = [
    {name: '宠物洗澡', img: '../../../assets/img/s2.png'},
    {name: '宠物美容', img: '../../../assets/img/s3.png'},
    {name: '健康检查', img: '../../../assets/img/s4.png'},
    {name: '健康检查', img: '../../../assets/img/s5.png'}
  ];

  constructor() {
  }

  ngOnInit() {}

  /**
   * 菜单按钮事件
   * @param event
   */
  onMenu(event): void {
    this.menuText = event.target.text;
  }

}
