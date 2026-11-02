import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PolicyCatalogue } from './policy-catalogue';

describe('PolicyCatalogue', () => {
  let component: PolicyCatalogue;
  let fixture: ComponentFixture<PolicyCatalogue>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PolicyCatalogue],
    }).compileComponents();

    fixture = TestBed.createComponent(PolicyCatalogue);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
