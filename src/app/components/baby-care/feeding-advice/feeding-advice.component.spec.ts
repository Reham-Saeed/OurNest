import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeedingAdviceComponent } from './feeding-advice.component';

describe('FeedingAdviceComponent', () => {
  let component: FeedingAdviceComponent;
  let fixture: ComponentFixture<FeedingAdviceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FeedingAdviceComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FeedingAdviceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
