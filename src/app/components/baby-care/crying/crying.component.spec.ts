import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CryingComponent } from './crying.component';

describe('CryingComponent', () => {
  let component: CryingComponent;
  let fixture: ComponentFixture<CryingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CryingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CryingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
