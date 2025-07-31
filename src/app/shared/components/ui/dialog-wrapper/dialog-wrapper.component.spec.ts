import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { DialogWrapperComponent, DialogWrapperConfig } from './dialog-wrapper.component';

describe('DialogWrapperComponent', () => {
  let component: DialogWrapperComponent;
  let fixture: ComponentFixture<DialogWrapperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogWrapperComponent ],
      imports: [
        MatIconModule,
        MatButtonModule,
        MatProgressSpinnerModule
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogWrapperComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display title when config is provided', () => {
    const config: DialogWrapperConfig = {
      title: 'Test Dialog',
      subtitle: 'Test Subtitle',
      icon: 'info'
    };

    component.config = config;
    fixture.detectChanges();

    const titleElement = fixture.nativeElement.querySelector('.dialog-title');
    expect(titleElement.textContent).toContain('Test Dialog');
  });

  it('should emit close event when close button is clicked', () => {
    const config: DialogWrapperConfig = {
      title: 'Test Dialog',
      showCloseButton: true
    };

    component.config = config;
    fixture.detectChanges();

    spyOn(component.close, 'emit');
    const closeButton = fixture.nativeElement.querySelector('.close-button');
    closeButton.click();

    expect(component.close.emit).toHaveBeenCalled();
  });

  it('should emit retry event when retry button is clicked', () => {
    component.showError = true;
    component.errorMessage = 'Test error';
    fixture.detectChanges();

    spyOn(component.retry, 'emit');
    const retryButton = fixture.nativeElement.querySelector('button');
    retryButton.click();

    expect(component.retry.emit).toHaveBeenCalled();
  });
});
