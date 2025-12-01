import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThirdTrimesterComponent } from './third-trimester.component';

describe('ThirdTrimesterComponent', () => {
  let component: ThirdTrimesterComponent;
  let fixture: ComponentFixture<ThirdTrimesterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ThirdTrimesterComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ThirdTrimesterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
