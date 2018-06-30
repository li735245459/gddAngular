import {Injectable} from '@angular/core';
import {of} from 'rxjs';

@Injectable()
export class DataService {

  getData() {
    const total = 10000;
    let data = [];
    for (let i = 1; i <= total; i++) {
      let amount = Math.floor(Math.random() * 1000);
      let price = Math.floor(Math.random() * 1000);
      data.push({
        inv: 'Inv No ' + i,
        name: 'Name ' + i,
        amount: amount,
        price: price,
        cost: amount * price,
        note: 'Note ' + i
      });
    }
    return of({
      total: total,
      rows: data
    });
  }
}
