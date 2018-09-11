import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditAspUserComponent } from './edit-asp-user.component';

describe('EditAspUserComponent', () => {
  let component: EditAspUserComponent;
  let fixture: ComponentFixture<EditAspUserComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditAspUserComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditAspUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
