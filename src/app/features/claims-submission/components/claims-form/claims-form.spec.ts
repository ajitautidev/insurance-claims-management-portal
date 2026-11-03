import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ClaimsForm } from './claims-form';

describe('ClaimsForm', () => {
  let component: ClaimsForm;
  let fixture: ComponentFixture<ClaimsForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClaimsForm],
    }).compileComponents();

    fixture = TestBed.createComponent(ClaimsForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
