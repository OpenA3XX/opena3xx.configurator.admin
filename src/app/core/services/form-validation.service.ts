import { Injectable } from '@angular/core';
import { AbstractControl, FormGroup, ValidationErrors, ValidatorFn } from '@angular/forms';

interface FormErrors {
  [key: string]: ValidationErrors;
}

@Injectable({
  providedIn: 'root'
})
export class FormValidationService {

  /**
   * Mark all fields in a form group as touched to trigger validation display
   */
  markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      if (control) {
        control.markAsTouched();

        if (control instanceof FormGroup) {
          this.markFormGroupTouched(control);
        }
      }
    });
  }

  /**
   * Get all validation errors from a form group
   */
  getFormErrors(formGroup: FormGroup): FormErrors {
    const errors: FormErrors = {};

    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      if (control && control.errors && (control.dirty || control.touched)) {
        errors[key] = control.errors;
      }
    });

    return errors;
  }

  /**
   * Custom validator for hardware board names
   */
  hardwareBoardNameValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) return null;

      const value = control.value.toString().trim();
      const pattern = /^[A-Z0-9][A-Z0-9_-]*$/i;

      if (!pattern.test(value)) {
        return {
          hardwareBoardName: {
            message: 'Hardware board name must start with alphanumeric character and contain only letters, numbers, underscores, and hyphens'
          }
        };
      }

      return null;
    };
  }

  /**
   * Custom validator for IP addresses
   */
  ipAddressValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) return null;

      const ipPattern = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;

      if (!ipPattern.test(control.value)) {
        return {
          ipAddress: {
            message: 'Please enter a valid IP address'
          }
        };
      }

      return null;
    };
  }

  /**
   * Custom validator for port numbers
   */
  portNumberValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) return null;

      const port = parseInt(control.value, 10);

      if (isNaN(port) || port < 1 || port > 65535) {
        return {
          portNumber: {
            message: 'Port number must be between 1 and 65535'
          }
        };
      }

      return null;
    };
  }

  /**
   * Custom validator for hardware selector IDs
   */
  hardwareSelectorIdValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) return null;

      const id = parseInt(control.value, 10);

      if (isNaN(id) || id < 1) {
        return {
          hardwareSelectorId: {
            message: 'Hardware selector ID must be a positive number'
          }
        };
      }

      return null;
    };
  }

  /**
   * Get user-friendly error message for a control
   */
  getErrorMessage(control: AbstractControl, fieldName: string): string {
    if (!control.errors) return '';

    const errors = control.errors;

    if (errors['required']) {
      return `${fieldName} is required`;
    }

    if (errors['email']) {
      return `Please enter a valid email address`;
    }

    if (errors['minlength']) {
      return `${fieldName} must be at least ${errors['minlength'].requiredLength} characters`;
    }

    if (errors['maxlength']) {
      return `${fieldName} cannot exceed ${errors['maxlength'].requiredLength} characters`;
    }

    if (errors['pattern']) {
      return `${fieldName} format is invalid`;
    }

    if (errors['hardwareBoardName']) {
      return errors['hardwareBoardName'].message;
    }

    if (errors['ipAddress']) {
      return errors['ipAddress'].message;
    }

    if (errors['portNumber']) {
      return errors['portNumber'].message;
    }

    if (errors['hardwareSelectorId']) {
      return errors['hardwareSelectorId'].message;
    }

    return `${fieldName} is invalid`;
  }
}
