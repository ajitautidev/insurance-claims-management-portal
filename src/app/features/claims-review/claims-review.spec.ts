import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ClaimsReview } from './claims-review';

describe('ClaimsReview', () => {
  let component: ClaimsReview;
  let fixture: ComponentFixture<ClaimsReview>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClaimsReview],
    }).compileComponents();

    fixture = TestBed.createComponent(ClaimsReview);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
