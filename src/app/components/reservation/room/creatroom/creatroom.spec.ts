import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Creatroom } from './creatroom';

describe('Creatroom', () => {
  let component: Creatroom;
  let fixture: ComponentFixture<Creatroom>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Creatroom]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Creatroom);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
