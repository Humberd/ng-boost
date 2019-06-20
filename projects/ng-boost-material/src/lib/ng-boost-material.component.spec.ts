import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NgBoostMaterialComponent } from './ng-boost-material.component';

describe('NgBoostMaterialComponent', () => {
  let component: NgBoostMaterialComponent;
  let fixture: ComponentFixture<NgBoostMaterialComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NgBoostMaterialComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NgBoostMaterialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
