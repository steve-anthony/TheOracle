import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArrayNumberComponent } from './array-number.component';

describe('ArrayNumberComponent', () => {
  let component: ArrayNumberComponent;
  let fixture: ComponentFixture<ArrayNumberComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ArrayNumberComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ArrayNumberComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
