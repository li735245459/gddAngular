export const menus = [
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
      text: '图片分类',
      link: 'cover',
    }, {
      text: '图片信息',
      link: 'cover',
    }]
  }, {
    text: '商品管理',
    iconCls: 'fa fa-shopping-bag',
    children: [{
      text: '商品分类',
      link: 'cover',
    }, {
      text: '商品信息',
      link: 'cover',
    }]
  }, {
    text: '销售管理',
    iconCls: 'fa fa-pie-chart',
    children: [{
      text: '销售记录'
    }, {
      text: '销售统计'
    }]
  }, {
    text: '系统管理',
    iconCls: 'fa fa-print',
    children: [{
      text: '日志',
      link: 'log',
    },
      {
        text: '验证码',
        link: 'emailCode',
      }]
  }];
