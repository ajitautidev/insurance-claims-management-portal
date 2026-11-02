import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RiskAdmin } from './risk-admin';

describe('RiskAdmin', () => {
  let component: RiskAdmin;
  let fixture: ComponentFixture<RiskAdmin>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RiskAdmin],
    }).compileComponents();

    fixture = TestBed.createComponent(RiskAdmin);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
