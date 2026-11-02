import { ComponentFixture, TestBed } from '@angular/core/testing';
import { QuoteGeneration } from './quote-generation';

describe('QuoteGeneration', () => {
  let component: QuoteGeneration;
  let fixture: ComponentFixture<QuoteGeneration>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QuoteGeneration],
    }).compileComponents();

    fixture = TestBed.createComponent(QuoteGeneration);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
