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
