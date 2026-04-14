import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeedingTimeComponent } from './feeding-time.component';

describe('FeedingTimeComponent', () => {
  let component: FeedingTimeComponent;
  let fixture: ComponentFixture<FeedingTimeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FeedingTimeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FeedingTimeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
