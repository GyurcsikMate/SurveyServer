import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShortTextComponent } from './short-text.component';

describe('ShortTextComponent', () => {
  let component: ShortTextComponent;
  let fixture: ComponentFixture<ShortTextComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShortTextComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ShortTextComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
