import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PregnancyHealthComponent } from './pregnancy-health.component';

describe('PregnancyHealthComponent', () => {
  let component: PregnancyHealthComponent;
  let fixture: ComponentFixture<PregnancyHealthComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PregnancyHealthComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PregnancyHealthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
