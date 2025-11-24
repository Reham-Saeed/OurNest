import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PregnancyTipsComponent } from './pregnancy-tips.component';

describe('PregnancyTipsComponent', () => {
  let component: PregnancyTipsComponent;
  let fixture: ComponentFixture<PregnancyTipsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PregnancyTipsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PregnancyTipsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
