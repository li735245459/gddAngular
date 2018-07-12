import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GoodsTypeComponent } from './goods-type.component';

describe('GoodsTypeComponent', () => {
  let component: GoodsTypeComponent;
  let fixture: ComponentFixture<GoodsTypeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GoodsTypeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GoodsTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
