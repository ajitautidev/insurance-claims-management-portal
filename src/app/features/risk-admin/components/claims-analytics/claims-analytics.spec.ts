import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ClaimsAnalytics } from './claims-analytics';

describe('ClaimsAnalytics', () => {
  let component: ClaimsAnalytics;
  let fixture: ComponentFixture<ClaimsAnalytics>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClaimsAnalytics],
    }).compileComponents();

    fixture = TestBed.createComponent(ClaimsAnalytics);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
