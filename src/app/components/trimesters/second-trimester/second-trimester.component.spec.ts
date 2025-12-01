import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SecondTrimesterComponent } from './second-trimester.component';

describe('SecondTrimesterComponent', () => {
  let component: SecondTrimesterComponent;
  let fixture: ComponentFixture<SecondTrimesterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SecondTrimesterComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SecondTrimesterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
