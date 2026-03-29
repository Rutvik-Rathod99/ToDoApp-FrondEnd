import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MicrosoftCallbackComponent } from './microsoft-callback.component';

describe('MicrosoftCallbackComponent', () => {
  let component: MicrosoftCallbackComponent;
  let fixture: ComponentFixture<MicrosoftCallbackComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MicrosoftCallbackComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MicrosoftCallbackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
