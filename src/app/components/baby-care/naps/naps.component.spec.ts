import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NapsComponent } from './naps.component';

describe('NapsComponent', () => {
  let component: NapsComponent;
  let fixture: ComponentFixture<NapsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NapsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NapsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
