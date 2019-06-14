import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NgBoostComponent } from './ng-boost.component';

describe('NgBoostComponent', () => {
  let component: NgBoostComponent;
  let fixture: ComponentFixture<NgBoostComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NgBoostComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NgBoostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
