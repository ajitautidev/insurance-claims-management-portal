import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CustomerProfiles } from './customer-profiles';

describe('CustomerProfiles', () => {
  let component: CustomerProfiles;
  let fixture: ComponentFixture<CustomerProfiles>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomerProfiles],
    }).compileComponents();

    fixture = TestBed.createComponent(CustomerProfiles);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
