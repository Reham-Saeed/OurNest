import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MothersCommunityComponent } from './mothers-community.component';

describe('MothersCommunityComponent', () => {
  let component: MothersCommunityComponent;
  let fixture: ComponentFixture<MothersCommunityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MothersCommunityComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MothersCommunityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
