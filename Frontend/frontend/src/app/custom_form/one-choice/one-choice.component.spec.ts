import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OneChoiceComponent } from './one-choice.component';

describe('OneChoiceComponent', () => {
  let component: OneChoiceComponent;
  let fixture: ComponentFixture<OneChoiceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OneChoiceComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(OneChoiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
