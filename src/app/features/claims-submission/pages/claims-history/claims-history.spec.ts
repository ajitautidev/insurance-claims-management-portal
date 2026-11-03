import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ClaimsHistory } from './claims-history';

describe('ClaimsHistory', () => {
  let component: ClaimsHistory;
  let fixture: ComponentFixture<ClaimsHistory>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClaimsHistory],
    }).compileComponents();

    fixture = TestBed.createComponent(ClaimsHistory);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
