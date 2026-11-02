import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PolicyManagement } from './policy-management';

describe('PolicyManagement', () => {
  let component: PolicyManagement;
  let fixture: ComponentFixture<PolicyManagement>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PolicyManagement],
    }).compileComponents();

    fixture = TestBed.createComponent(PolicyManagement);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
