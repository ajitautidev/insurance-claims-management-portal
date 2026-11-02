import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ClaimsSubmission } from './claims-submission';

describe('ClaimsSubmission', () => {
  let component: ClaimsSubmission;
  let fixture: ComponentFixture<ClaimsSubmission>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClaimsSubmission],
    }).compileComponents();

    fixture = TestBed.createComponent(ClaimsSubmission);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
