import { InMemoryDbService } from 'angular-in-memory-web-api';

export class InMemoryDb implements InMemoryDbService {
  createDb() {
    const produces = [
      { id: 1, name: 'Product1', category: 'Category1', description: 'description1', price: 11 },
      { id: 2, name: 'Product2', category: 'Category2', description: 'description2', price: 22 },
      { id: 3, name: 'Product3', category: 'Category3', description: 'description3', price: 33 },
      { id: 4, name: 'Product4', category: 'Category4', description: 'description4', price: 44 },
      { id: 5, name: 'Product5', category: 'Category5', description: 'description5', price: 55 },
      { id: 6, name: 'Product6', category: 'Category6', description: 'description6', price: 66 },
      { id: 7, name: 'Product7', category: 'Category7', description: 'description7', price: 77 },
      { id: 8, name: 'Product8', category: 'Category8', description: 'description8', price: 88 },
      { id: 9, name: 'Product9', category: 'Category9', description: 'description9', price: 99 },
      { id: 10, name: 'Product10', category: 'Category10', description: 'description10', price: 100 },
      { id: 11, name: 'Product11', category: 'Category11', description: 'description11', price: 110 },
      { id: 12, name: 'Product12', category: 'Category12', description: 'description12', price: 120 },
      { id: 13, name: 'Product13', category: 'Category13', description: 'description13', price: 130 },
      { id: 14, name: 'Product14', category: 'Category14', description: 'description14', price: 140 },
      { id: 15, name: 'Product15', category: 'Category15', description: 'description15', price: 150 },
      { id: 16, name: 'Product16', category: 'Category16', description: 'description16', price: 160 },
      { id: 17, name: 'Product17', category: 'Category17', description: 'description17', price: 170 },
      { id: 18, name: 'Product18', category: 'Category18', description: 'description18', price: 180 },
    ];
    const heroes = [
      { id: 11, name: 'Mr. Nice' },
      { id: 12, name: 'Narco' },
      { id: 13, name: 'Bombasto' },
      { id: 14, name: 'Celeritas' },
      { id: 15, name: 'Magneta' },
      { id: 16, name: 'RubberMan' },
      { id: 17, name: 'Dynama' },
      { id: 18, name: 'Dr IQ' },
      { id: 19, name: 'Magma' },
      { id: 20, name: 'Tornado' }
    ];
    return {produces, heroes};
  }
}

export const china = {
  'province': {
    '1': '北京市',
    '2': '天津市',
    '3': '上海市',
    '4': '重庆市',
    '5': '河北省',
    '6': '山西省',
    '7': '陕西省',
    '8': '山东省',
    '9': '河南省',
    '10': '辽宁省',
    '11': '吉林省',
    '12': '黑龙江省',
    '13': '江苏省',
    '14': '浙江省',
    '15': '安徽省',
    '16': '江西省',
    '17': '福建省',
    '19': '湖北省',
    '20': '湖南省',
    '21': '四川省',
    '22': '贵州省',
    '23': '云南省',
    '24': '广东省',
    '25': '海南省',
    '26': '甘肃省',
    '27': '青海省',
    '28': '内蒙古自治区',
    '29': '新疆维吾尔自治区',
    '30': '西藏自治区',
    '31': '广西壮族自治区',
    '32': '宁夏回族自治区',
  },
  'city': {
    '1': [
      '东城区', '西城区', '崇文区', '宣武区', '朝阳区', '海淀区', '丰台区', '石景山区', '房山区', '通州区', '顺义区', '大兴区',
      '昌平区', '平谷区', '怀柔区', '门头沟区', '密云县', '延庆县'
    ],
    '2': [
      '和平区', '河东区', '河西区', '南开区', '河北区', '红桥区', '塘沽区', '汉沽区', '大港区', '东丽区', '西青区', '津南区',
      '北辰区', '武清区', '宝坻区', '蓟县', '宁河县', '静海县'
    ],
    '3': [
      '宝山', '崇明', '嘉定', '青浦', '松江', '金山', '奉贤', '闵行', '浦东新区', '普陀', '长宁', '徐汇', '卢湾', '静安', '闸北',
      '虹口', '黄浦', '杨浦'
    ],
    '4': [
      '万州区', '涪陵区', '渝中区', '大渡口区', '江北区', '沙坪坝区', '九龙坡区', '南岸区', '北碚区',
      '綦江区', '大足区', '渝北区', '巴南区', '黔江区', '长寿区', '江津区', '合川区',
      '永川区', '南川区', '潼南县', '铜梁县', '荣昌县', '璧山县', '梁平县', '城口县',
      '丰都县', '垫江县' , '武隆县' , '忠县', '开县', '云阳县', '奉节县', '巫山县', '巫溪县', '石柱土家族自治县' , '秀山土家族苗族自治县', '酉阳土家族苗族自治县', '彭水苗族土家族自治县'
    ],
    '5': {
      '5.1': '承德市', '5.2': '张家口市', '5.3': '保定市', '5.4': '石家庄市', '5.5': '邢台市', '5.6': '邯郸市',
      '5.7': '衡水市', '5.8': '沧州市', '5.9': '廊坊市', '5.10': '唐山市', '5.11': '秦皇岛市'
    },
    '6': {

    },
    '7': {

    },
    '8': {

    },
    '9': {

    },
    '10': {

    },
    '11': {

    },
    '12': {

    },
    '13': {

    },
    '14': {

    },
    '15': {

    },
    '16': {

    },
    '17': {

    },
    '18': {

    },
    '19': {

    },
    '20': {

    },
    '21': {

    },
    '22': {

    },
    '23': {

    },
    '24': {

    },
    '25': {

    },
    '26': {

    },
    '27': {

    },
    '28': {

    },
    '29': {

    },
    '30': {

    }
  },
  'area': {

  }
};
