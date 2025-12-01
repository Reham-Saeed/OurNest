import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FirstTrimesterComponent } from './first-trimester.component';

describe('FirstTrimesterComponent', () => {
  let component: FirstTrimesterComponent;
  let fixture: ComponentFixture<FirstTrimesterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FirstTrimesterComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FirstTrimesterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
