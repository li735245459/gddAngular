import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css']
})
export class IndexComponent implements OnInit {
  menuText = '首页';
  hotPets = [
    {name: '德国边牧', introduce: '边境牧羊犬原产于苏格兰边境', img: '../../../assets/img/h1.jpg'},
    {name: '法国斗牛士', introduce: '边境牧羊犬原产于苏格兰边境，为柯利牧羊犬的一种', img: '../../../assets/img/h2.jpg'},
    {name: '德国牧羊', introduce: '边境牧羊犬原产于苏格兰边境，为柯利牧羊犬的一种，具有强烈的牧羊本能，', img: '../../../assets/img/h3.jpg'},
    {name: '逗比哈士奇', introduce: '边境牧羊犬原产于苏格兰边境，为柯利牧羊犬的一种，具有强烈的牧羊本能，天性聪颖、善于察言观色，能准确明白主人的指示', img: '../../../assets/img/h4.jpg'},
  ];
  hotTerms = [
    {name: '剪刀杀手', introduce: '世间武功唯快不破', img: '../../../assets/img/t1.jpg'},
    {name: '血饮狂人', introduce: '世间武功唯快不破', img: '../../../assets/img/t2.jpg'},
    {name: '北腿王', introduce: '世间武功唯快不破', img: '../../../assets/img/t3.jpg'},
    {name: '西门庆', introduce: '世间武功唯快不破', img: '../../../assets/img/t4.jpg'},
  ];
  banners = [
    {name: '导航图片1', introduce: 'This carousel uses customized default values.', img: '../../../assets/img/h5.jpg'},
    {name: '导航图片2', introduce: 'This carousel uses customized default values.', img: '../../../assets/img/h6.jpg'},
    {name: '导航图片3', introduce: 'This carousel uses customized default values.', img: '../../../assets/img/h7.jpg'},
    {name: '导航图片3', introduce: 'This carousel uses customized default values.', img: '../../../assets/img/h8.jpg'}
  ];
  service = [
    {name: '宠物寄养', img: '../../../assets/img/s1.png'},
    {name: '宠物洗澡', img: '../../../assets/img/s2.png'},
    {name: '宠物美容', img: '../../../assets/img/s3.png'},
    {name: '健康检查', img: '../../../assets/img/s4.png'}
  ];

  constructor() {
  }

  ngOnInit() {
  }

}
