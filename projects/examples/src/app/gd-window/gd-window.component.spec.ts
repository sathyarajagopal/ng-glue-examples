import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GdWindowComponent } from './gd-window.component';

describe('GdWindowComponent', () => {
  let component: GdWindowComponent;
  let fixture: ComponentFixture<GdWindowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GdWindowComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GdWindowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
