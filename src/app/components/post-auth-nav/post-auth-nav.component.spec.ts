import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostAuthNavComponent } from './post-auth-nav.component';

describe('PostAuthNavComponent', () => {
  let component: PostAuthNavComponent;
  let fixture: ComponentFixture<PostAuthNavComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PostAuthNavComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PostAuthNavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
