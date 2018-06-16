import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-pets',
  templateUrl: './pets.component.html',
  styleUrls: ['./pets.component.css']
})
export class PetsComponent implements OnInit {
  hotPets = [
    {
      name: '德国边牧',
      introduce: '边境牧羊犬原产于苏格兰边境',
      img: '../../../assets/img/h1.jpg',
      link: 'https://baike.baidu.com/item/%E6%B3%95%E5%9B%BD%E6%96%97%E7%89%9B%E7%8A%AC'
    },
    {
      name: '法国斗牛士',
      introduce: '边境牧羊犬原产于苏格兰边境，为柯利牧羊犬的一种',
      img: '../../../assets/img/h2.jpg',
      link: 'https://baike.baidu.com/item/%E6%B3%95%E5%9B%BD%E6%96%97%E7%89%9B%E7%8A%AC'
    },
    {
      name: '法国斗牛士',
      introduce: '边境牧羊犬原产于苏格兰边境，为柯利牧羊犬的一种',
      img: '../../../assets/img/h2.jpg',
      link: 'https://baike.baidu.com/item/%E6%B3%95%E5%9B%BD%E6%96%97%E7%89%9B%E7%8A%AC'
    },
    {
      name: '德国牧羊',
      introduce: '边境牧羊犬原产于苏格兰边境，为柯利牧羊犬的一种，具有强烈的牧羊本能，',
      img: '../../../assets/img/h3.jpg',
      link: 'https://baike.baidu.com/item/%E6%B3%95%E5%9B%BD%E6%96%97%E7%89%9B%E7%8A%AC'
    },
    {
      name: '德国牧羊',
      introduce: '边境牧羊犬原产于苏格兰边境，为柯利牧羊犬的一种，具有强烈的牧羊本能，',
      img: '../../../assets/img/h3.jpg',
      link: 'https://baike.baidu.com/item/%E6%B3%95%E5%9B%BD%E6%96%97%E7%89%9B%E7%8A%AC'
    },
    {
      name: '德国牧羊',
      introduce: '边境牧羊犬原产于苏格兰边境，为柯利牧羊犬的一种，具有强烈的牧羊本能，',
      img: '../../../assets/img/h3.jpg',
      link: 'https://baike.baidu.com/item/%E6%B3%95%E5%9B%BD%E6%96%97%E7%89%9B%E7%8A%AC'
    },
    {
      name: '德国牧羊',
      introduce: '边境牧羊犬原产于苏格兰边境，为柯利牧羊犬的一种，具有强烈的牧羊本能，',
      img: '../../../assets/img/h3.jpg',
      link: 'https://baike.baidu.com/item/%E6%B3%95%E5%9B%BD%E6%96%97%E7%89%9B%E7%8A%AC'
    },
    {
      name: '德国牧羊',
      introduce: '边境牧羊犬原产于苏格兰边境，为柯利牧羊犬的一种，具有强烈的牧羊本能，',
      img: '../../../assets/img/h3.jpg',
      link: 'https://baike.baidu.com/item/%E6%B3%95%E5%9B%BD%E6%96%97%E7%89%9B%E7%8A%AC'
    },
    {
      name: '德国牧羊',
      introduce: '边境牧羊犬原产于苏格兰边境，为柯利牧羊犬的一种，具有强烈的牧羊本能，',
      img: '../../../assets/img/h3.jpg',
      link: 'https://baike.baidu.com/item/%E6%B3%95%E5%9B%BD%E6%96%97%E7%89%9B%E7%8A%AC'
    },
    {
      name: '德国牧羊',
      introduce: '边境牧羊犬原产于苏格兰边境，为柯利牧羊犬的一种，具有强烈的牧羊本能，',
      img: '../../../assets/img/h3.jpg',
      link: 'https://baike.baidu.com/item/%E6%B3%95%E5%9B%BD%E6%96%97%E7%89%9B%E7%8A%AC'
    },
    {
      name: '德国牧羊',
      introduce: '边境牧羊犬原产于苏格兰边境，为柯利牧羊犬的一种，具有强烈的牧羊本能，',
      img: '../../../assets/img/h3.jpg',
      link: 'https://baike.baidu.com/item/%E6%B3%95%E5%9B%BD%E6%96%97%E7%89%9B%E7%8A%AC'
    },
    {
      name: '德国牧羊',
      introduce: '边境牧羊犬原产于苏格兰边境，为柯利牧羊犬的一种，具有强烈的牧羊本能，',
      img: '../../../assets/img/h3.jpg',
      link: 'https://baike.baidu.com/item/%E6%B3%95%E5%9B%BD%E6%96%97%E7%89%9B%E7%8A%AC'
    },
    {
      name: '德国牧羊',
      introduce: '边境牧羊犬原产于苏格兰边境，为柯利牧羊犬的一种，具有强烈的牧羊本能，',
      img: '../../../assets/img/h3.jpg',
      link: 'https://baike.baidu.com/item/%E6%B3%95%E5%9B%BD%E6%96%97%E7%89%9B%E7%8A%AC'
    },
    {
      name: '德国牧羊',
      introduce: '边境牧羊犬原产于苏格兰边境，为柯利牧羊犬的一种，具有强烈的牧羊本能，',
      img: '../../../assets/img/h3.jpg',
      link: 'https://baike.baidu.com/item/%E6%B3%95%E5%9B%BD%E6%96%97%E7%89%9B%E7%8A%AC'
    },
    {
      name: '德国牧羊',
      introduce: '边境牧羊犬原产于苏格兰边境，为柯利牧羊犬的一种，具有强烈的牧羊本能，',
      img: '../../../assets/img/h3.jpg',
      link: 'https://baike.baidu.com/item/%E6%B3%95%E5%9B%BD%E6%96%97%E7%89%9B%E7%8A%AC'
    }
  ];

  constructor() {
  }

  ngOnInit() {
  }

}
