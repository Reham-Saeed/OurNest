import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestionsFlowComponent } from './questions-flow.component';

describe('QuestionsFlowComponent', () => {
  let component: QuestionsFlowComponent;
  let fixture: ComponentFixture<QuestionsFlowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QuestionsFlowComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QuestionsFlowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
