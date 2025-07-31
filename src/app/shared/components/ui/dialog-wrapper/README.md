# Dialog Wrapper Component

A reusable wrapper component that provides consistent UI/UX styling for dialogs while keeping existing dialog logic intact.

## Features

- **Consistent Header**: Standardized title, subtitle, and icon display
- **Flexible Sizing**: Small, medium, large, and fullscreen size options
- **Loading States**: Built-in loading overlay with spinner
- **Error States**: Error overlay with retry functionality
- **Content Projection**: Uses `ng-content` to preserve existing dialog content
- **Action Footer**: Optional footer area for action buttons

## Usage

### Basic Usage

```html
<opena3xx-dialog-wrapper [config]="wrapperConfig">
  <!-- Your existing dialog content goes here -->
  <div class="your-content">
    <p>Your dialog content remains unchanged</p>
  </div>
  
  <!-- Optional: Action buttons in footer -->
  <div dialog-actions>
    <button mat-button (click)="onCancel()">Cancel</button>
    <button mat-raised-button color="primary" (click)="onConfirm()">Confirm</button>
  </div>
</opena3xx-dialog-wrapper>
```

### Configuration

```typescript
import { DialogWrapperConfig } from './dialog-wrapper.component';

wrapperConfig: DialogWrapperConfig = {
  title: 'Dialog Title',
  subtitle: 'Optional subtitle',
  icon: 'info', // Material icon name
  size: 'medium', // 'small' | 'medium' | 'large' | 'fullscreen'
  showCloseButton: true,
  customClass: 'my-custom-class'
};
```

### Loading State

```html
<opena3xx-dialog-wrapper [config]="wrapperConfig" [showLoading]="isLoading">
  <!-- Content will be dimmed when loading -->
</opena3xx-dialog-wrapper>
```

### Error State

```html
<opena3xx-dialog-wrapper 
  [config]="wrapperConfig" 
  [showError]="hasError" 
  [errorMessage]="errorMessage"
  (retry)="onRetry()">
  <!-- Content will be dimmed when error is shown -->
</opena3xx-dialog-wrapper>
```

### Dark Theme

The dialog wrapper automatically supports dark theme when the `body` element has the `dark-theme` class. No additional configuration is needed.

```html
<opena3xx-dialog-wrapper [config]="wrapperConfig">
  <!-- Dialog will automatically use dark theme when body has dark-theme class -->
</opena3xx-dialog-wrapper>
```

## Configuration Options

### DialogWrapperConfig

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `title` | string | - | Dialog title (required) |
| `subtitle` | string | - | Optional subtitle |
| `icon` | string | - | Material icon name |
| `size` | 'small' \| 'medium' \| 'large' \| 'fullscreen' | 'medium' | Dialog size |
| `showCloseButton` | boolean | true | Show close button in header |
| `closeOnBackdropClick` | boolean | true | Close on backdrop click |
| `customClass` | string | - | Additional CSS class |
| `showFooter` | boolean | false | Show footer area for action buttons |

### Size Variants

- **small**: 400px max-width, 500px max-height
- **medium**: 600px max-width, 700px max-height  
- **large**: 800px max-width, 900px max-height
- **fullscreen**: 95vw max-width, 95vh max-height

## Events

- `(close)`: Emitted when close button is clicked
- `(retry)`: Emitted when retry button is clicked in error state

## Migration Strategy

1. **Wrap existing dialog content** with `<opena3xx-dialog-wrapper>`
2. **Configure the wrapper** with appropriate title, icon, and size
3. **Move action buttons** to the `[dialog-actions]` slot if desired
4. **Add loading/error states** as needed

## Examples

### Simple Confirmation Dialog

```html
<opena3xx-dialog-wrapper [config]="{
  title: 'Confirm Delete',
  subtitle: 'This action cannot be undone',
  icon: 'delete',
  size: 'small'
}">
  <p>Are you sure you want to delete this item?</p>
  
  <div dialog-actions>
    <button mat-button (click)="onCancel()">Cancel</button>
    <button mat-raised-button color="warn" (click)="onConfirm()">Delete</button>
  </div>
</opena3xx-dialog-wrapper>
```

### Form Dialog

```html
<opena3xx-dialog-wrapper [config]="{
  title: 'Add New Item',
  subtitle: 'Enter the details below',
  icon: 'add',
  size: 'medium'
}" [showLoading]="loading" [showError]="!!error" [errorMessage]="error">
  <form [formGroup]="form" (ngSubmit)="onSubmit()">
    <!-- Your existing form fields -->
    <mat-form-field appearance="outline">
      <mat-label>Name</mat-label>
      <input matInput formControlName="name">
    </mat-form-field>
  </form>
  
  <div dialog-actions>
    <button mat-button (click)="onCancel()">Cancel</button>
    <button mat-raised-button color="primary" type="submit" [disabled]="form.invalid || loading">
      Save
    </button>
  </div>
</opena3xx-dialog-wrapper>
```

### View Dialog

```html
<opena3xx-dialog-wrapper [config]="{
  title: 'Item Details',
  icon: 'info',
  size: 'large'
}">
  <div class="item-details">
    <h3>Information</h3>
    <p><strong>Name:</strong> {{ item.name }}</p>
    <p><strong>Type:</strong> {{ item.type }}</p>
  </div>
  
  <div dialog-actions>
    <button mat-raised-button (click)="onClose()">Close</button>
  </div>
</opena3xx-dialog-wrapper>
``` 
