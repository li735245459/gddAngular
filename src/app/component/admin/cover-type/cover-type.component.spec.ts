import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CoverTypeComponent } from './cover-type.component';

describe('CoverTypeComponent', () => {
  let component: CoverTypeComponent;
  let fixture: ComponentFixture<CoverTypeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CoverTypeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CoverTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
