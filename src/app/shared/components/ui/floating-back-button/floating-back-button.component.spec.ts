import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { RouterTestingModule } from '@angular/router/testing';
import { MaterialModule } from '../../../../material.module';
import { FloatingBackButtonComponent } from './floating-back-button.component';

describe('FloatingBackButtonComponent', () => {
  let component: FloatingBackButtonComponent;
  let fixture: ComponentFixture<FloatingBackButtonComponent>;
  let router: Router;
  let location: Location;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([
          { path: 'dashboard', component: FloatingBackButtonComponent },
          { path: 'test', component: FloatingBackButtonComponent }
        ]),
        MaterialModule
      ],
      declarations: [FloatingBackButtonComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(FloatingBackButtonComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    location = TestBed.inject(Location);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show button when not on dashboard', () => {
    // Navigate to a non-dashboard route
    router.navigateByUrl('/test');
    fixture.detectChanges();

    expect(component.showButton).toBe(true);
  });

  it('should hide button when on dashboard', () => {
    // Navigate to dashboard
    router.navigateByUrl('/dashboard');
    fixture.detectChanges();

    expect(component.showButton).toBe(false);
  });

  it('should call goBack when clicked', () => {
    spyOn(component, 'goBack');

    // Navigate to a non-dashboard route to show the button
    router.navigateByUrl('/test');
    fixture.detectChanges();

    const button = fixture.nativeElement.querySelector('.floating-back-button');
    button.click();

    expect(component.goBack).toHaveBeenCalled();
  });
});
