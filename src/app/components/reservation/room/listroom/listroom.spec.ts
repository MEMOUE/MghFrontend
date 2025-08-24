import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Listroom } from './listroom';

describe('Listroom', () => {
  let component: Listroom;
  let fixture: ComponentFixture<Listroom>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Listroom]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Listroom);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
