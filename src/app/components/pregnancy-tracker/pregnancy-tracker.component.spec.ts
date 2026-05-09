import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PregnancyTrackerComponent } from './pregnancy-tracker.component';

describe('PregnancyTrackerComponent', () => {
  let component: PregnancyTrackerComponent;
  let fixture: ComponentFixture<PregnancyTrackerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PregnancyTrackerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PregnancyTrackerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
