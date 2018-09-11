import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateAspUserComponent } from './create-asp-user.component';

describe('CreateAspUserComponent', () => {
  let component: CreateAspUserComponent;
  let fixture: ComponentFixture<CreateAspUserComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateAspUserComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateAspUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
