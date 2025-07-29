# OpenA3XX Configurator Admin - Component Documentation

## Overview

This document provides comprehensive documentation for all components, services, and utilities implemented in the OpenA3XX Configurator Admin application. The application follows Angular's standalone component architecture and implements modern reactive patterns using signals and observables.

## Table of Contents

1. [Form Components](#form-components)
2. [UI Components](#ui-components)
3. [Services](#services)
4. [Testing Infrastructure](#testing-infrastructure)
5. [Migration Guide](#migration-guide)
6. [Best Practices](#best-practices)

---

## Form Components

### DynamicFormComponent

**Location**: `src/app/shared/components/forms/dynamic-form.component.ts`

**Purpose**: A highly configurable, reusable form component that generates forms dynamically based on configuration objects.

**Features**:
- Configuration-driven form generation
- Multiple layout options (single, two-column, three-column)
- Built-in validation
- Conditional field visibility
- Real-time form state tracking
- Accessibility support

**Usage**:
```typescript
const formConfig: DynamicFormConfig = {
  title: 'User Registration',
  subtitle: 'Create a new user account',
  fields: [
    {
      key: 'name',
      label: 'Full Name',
      type: 'text',
      required: true,
      validation: { required: true, minLength: 2 }
    },
    {
      key: 'email',
      label: 'Email Address',
      type: 'email',
      required: true,
      validation: { required: true, email: true }
    }
  ],
  layout: 'single',
  submitText: 'Register',
  cancelText: 'Cancel',
  showCancel: true
};
```

**Template**:
```html
<opena3xx-dynamic-form
  [config]="formConfig"
  (formSubmit)="onFormSubmit($event)"
  (formCancel)="onFormCancel()">
</opena3xx-dynamic-form>
```

### FormFieldComponent

**Location**: `src/app/shared/components/forms/form-field.component.ts`

**Purpose**: Individual form field component that supports various input types and validation.

**Supported Field Types**:
- `text` - Standard text input
- `number` - Numeric input
- `email` - Email input with validation
- `password` - Password input
- `textarea` - Multi-line text input
- `select` - Dropdown selection
- `checkbox` - Boolean checkbox
- `toggle` - Material toggle switch
- `date` - Date picker
- `time` - Time picker
- `url` - URL input

**Features**:
- Conditional visibility based on other fields
- Custom validation rules
- Error message customization
- Accessibility features
- Responsive design

---

## UI Components

### DashboardWidgetComponent

**Location**: `src/app/shared/components/ui/dashboard-widget/dashboard-widget.component.ts`

**Purpose**: Reusable dashboard widget component for displaying various types of data and metrics.

**Widget Types**:
- `metric` - Display key metrics with trends
- `progress` - Progress bars and completion indicators
- `status` - Status indicators with icons
- `list` - List of items with icons and values
- `chart` - Placeholder for chart visualizations

**Features**:
- Multiple size options (small, medium, large, full)
- Real-time data updates
- Collapsible widgets
- Interactive actions
- Responsive design
- Dark theme support

**Usage**:
```typescript
const widgetData: WidgetData = {
  title: 'System Status',
  value: 'Online',
  status: 'success',
  icon: 'check_circle',
  description: 'All systems operational'
};

const widgetConfig: WidgetConfig = {
  type: 'status',
  size: 'medium',
  refreshInterval: 5000,
  showActions: true,
  collapsible: true
};
```

**Template**:
```html
<opena3xx-dashboard-widget
  [data]="widgetData"
  [config]="widgetConfig"
  [actions]="widgetActions"
  (onAction)="onWidgetAction($event)">
</opena3xx-dashboard-widget>
```

### AdvancedFilterComponent

**Location**: `src/app/shared/components/ui/advanced-filter/advanced-filter.component.ts`

**Purpose**: Advanced filtering component with multiple filter types and real-time filtering.

**Filter Types**:
- `text` - Text search with various operators
- `select` - Single selection dropdown
- `multiselect` - Multiple selection
- `date` - Date range filtering
- `dateRange` - Date range with start/end
- `checkbox` - Boolean filters
- `toggle` - Toggle switches
- `number` - Numeric filtering
- `numberRange` - Numeric range filtering

**Features**:
- Multiple filter types
- Real-time filtering
- Active filter chips
- Filter persistence
- Responsive design
- Accessibility support

---

## Services

### ExportImportService

**Location**: `src/app/shared/services/export-import.service.ts`

**Purpose**: Comprehensive data export and import functionality with multiple formats and validation.

**Features**:
- Multiple export formats (JSON, CSV, XLSX)
- Data validation
- Configuration backup/restore
- Metadata tracking
- Error handling
- Progress tracking

**Usage**:
```typescript
// Export data
this.exportImportService.exportData(data, {
  format: 'json',
  includeMetadata: true,
  compress: false
}).subscribe(result => {
  console.log('Export completed:', result);
});

// Import data
this.exportImportService.importData(file, {
  validateData: true,
  overwriteExisting: false,
  createBackup: true
}).subscribe(result => {
  console.log('Import completed:', result);
});
```

### PerformanceMonitorService

**Location**: `src/app/shared/services/performance-monitor.service.ts`

**Purpose**: Real-time performance monitoring with metrics collection and alerting.

**Metrics Categories**:
- Memory usage
- CPU usage
- Network activity
- UI performance
- API response times

**Features**:
- Real-time metric collection
- Configurable alert thresholds
- Performance analysis
- Alert management
- Historical data retention

**Usage**:
```typescript
// Track API performance
const tracker = this.performanceMonitor.trackApiCall('/api/data', 'GET', Date.now());
// ... API call ...
tracker(Date.now(), success);

// Get performance summary
this.performanceMonitor.getPerformanceSummary().subscribe(summary => {
  console.log('Performance summary:', summary);
});
```

### AdvancedSearchService

**Location**: `src/app/shared/services/advanced-search.service.ts`

**Purpose**: Advanced search functionality with full-text search, filtering, and result highlighting.

**Features**:
- Full-text search
- Fuzzy matching
- Advanced filtering
- Search result highlighting
- Search history
- Auto-complete suggestions
- Faceted search

**Usage**:
```typescript
// Perform search
this.searchService.search(data, {
  query: 'hardware panel',
  filters: [
    { field: 'category', operator: 'equals', value: 'input' }
  ],
  highlight: true,
  fuzzy: true
}).subscribe(response => {
  console.log('Search results:', response.results);
});
```

### BulkOperationsService

**Location**: `src/app/shared/services/bulk-operations.service.ts`

**Purpose**: Bulk operations for delete, update, import, and export with progress tracking.

**Features**:
- Batch processing
- Progress tracking
- Error handling
- Retry logic
- Operation cancellation
- Performance optimization

**Usage**:
```typescript
// Bulk delete
this.bulkOperations.bulkDelete(items, deleteFunction, {
  batchSize: 10,
  retryAttempts: 3,
  showProgress: true
}).subscribe(operation => {
  console.log('Bulk operation:', operation);
});
```

### RealTimeNotificationService

**Location**: `src/app/shared/services/real-time-notification.service.ts`

**Purpose**: WebSocket-based real-time notification system.

**Features**:
- WebSocket connectivity
- Automatic reconnection
- Notification categories
- Priority levels
- Expiration handling
- Filtering capabilities

**Usage**:
```typescript
// Connect to WebSocket
this.notificationService.connect('ws://localhost:8080/notifications');

// Add notification
this.notificationService.addNotification({
  type: 'info',
  title: 'System Update',
  message: 'System has been updated successfully',
  category: 'system'
});
```

---

## Testing Infrastructure

### TestUtilityService

**Location**: `src/app/shared/services/test-utility.service.ts`

**Purpose**: Comprehensive testing utilities for unit, integration, and E2E testing.

**Features**:
- Test data generation
- Mock service creation
- Component fixture utilities
- Form testing helpers
- Performance testing
- Test scenario management

**Usage**:
```typescript
// Generate test data
const testData = this.testUtility.generateTestData('panel', 5);

// Create mock service
const mockService = this.testUtility.createHardwareServiceMock();

// Run performance tests
this.testUtility.addPerformanceTest({
  name: 'Component Render',
  iterations: 100,
  testFunction: () => component.render(),
  expectedMaxTime: 50
});
```

---

## Migration Guide

### Converting to Standalone Components

1. **Update Component Decorator**:
```typescript
// Before
@Component({
  selector: 'app-component',
  templateUrl: './component.html',
  styleUrls: ['./component.scss'],
  standalone: false
})

// After
@Component({
  selector: 'app-component',
  templateUrl: './component.html',
  styleUrls: ['./component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    // ... other imports
  ]
})
```

2. **Update NgModule**:
```typescript
// Remove from declarations and exports
@NgModule({
  declarations: [
    // Remove standalone components
  ],
  exports: [
    // Remove standalone components
  ]
})
```

3. **Update Templates**:
```html
<!-- Use new standardized components -->
<opena3xx-page-layout>
  <opena3xx-loading-wrapper>
    <opena3xx-dynamic-form>
    </opena3xx-dynamic-form>
  </opena3xx-loading-wrapper>
</opena3xx-page-layout>
```

### Using Signals and Reactive Patterns

1. **Replace Properties with Signals**:
```typescript
// Before
loading = false;
error = false;

// After
loading = signal(false);
error = signal(false);
```

2. **Use Computed Properties**:
```typescript
// Before
get isFormValid(): boolean {
  return this.form.valid;
}

// After
isFormValid = computed(() => this.form.valid);
```

3. **Update Templates**:
```html
<!-- Before -->
<div *ngIf="loading">Loading...</div>

<!-- After -->
<div *ngIf="loading()">Loading...</div>
```

---

## Best Practices

### Component Design

1. **Use Standalone Components**: All new components should be standalone
2. **Implement Signals**: Use signals for reactive state management
3. **Follow Single Responsibility**: Each component should have one clear purpose
4. **Use TypeScript Strictly**: Enable strict TypeScript configuration
5. **Implement Error Boundaries**: Handle errors gracefully

### Service Design

1. **Use Dependency Injection**: Inject services rather than creating instances
2. **Implement Observable Patterns**: Use RxJS for async operations
3. **Handle Errors**: Implement proper error handling
4. **Use Interfaces**: Define clear interfaces for data structures
5. **Implement Caching**: Cache frequently accessed data

### Testing

1. **Unit Test Components**: Test component logic and behavior
2. **Integration Test Services**: Test service interactions
3. **E2E Test User Flows**: Test complete user journeys
4. **Performance Test**: Test component and service performance
5. **Mock Dependencies**: Use mocks for external dependencies

### Performance

1. **Use OnPush Change Detection**: Implement OnPush strategy
2. **Lazy Load Components**: Load components on demand
3. **Optimize Bundle Size**: Minimize bundle size
4. **Use Virtual Scrolling**: For large lists
5. **Implement Caching**: Cache API responses

### Accessibility

1. **Use Semantic HTML**: Use proper HTML elements
2. **Implement ARIA Labels**: Add proper ARIA attributes
3. **Keyboard Navigation**: Ensure keyboard accessibility
4. **Screen Reader Support**: Test with screen readers
5. **Color Contrast**: Ensure proper color contrast

### Security

1. **Validate Input**: Validate all user inputs
2. **Sanitize Data**: Sanitize data before rendering
3. **Use HTTPS**: Use HTTPS in production
4. **Implement CSRF Protection**: Protect against CSRF attacks
5. **Secure Headers**: Use secure HTTP headers

---

## API Reference

### Interfaces

#### DynamicFormConfig
```typescript
interface DynamicFormConfig {
  title?: string;
  subtitle?: string;
  fields: FormFieldConfig[];
  layout?: 'single' | 'two-column' | 'three-column';
  submitText?: string;
  cancelText?: string;
  showCancel?: boolean;
  loading?: boolean;
  disabled?: boolean;
}
```

#### WidgetData
```typescript
interface WidgetData {
  title: string;
  value: number | string;
  unit?: string;
  change?: number;
  changeType?: 'increase' | 'decrease' | 'neutral';
  status?: 'success' | 'warning' | 'error' | 'info';
  trend?: number[];
  maxValue?: number;
  minValue?: number;
  target?: number;
  description?: string;
  icon?: string;
  color?: string;
}
```

#### SearchOptions
```typescript
interface SearchOptions {
  query: string;
  filters?: SearchFilter[];
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  limit?: number;
  offset?: number;
  highlight?: boolean;
  fuzzy?: boolean;
  searchFields?: string[];
  excludeFields?: string[];
}
```

### Methods

#### ExportImportService
- `exportData(data: any[], options: ExportOptions): Observable<ExportResult>`
- `importData(file: File, options: ImportOptions): Observable<ImportResult>`
- `createBackup(data: any): Observable<ExportResult>`
- `restoreFromBackup(file: File): Observable<ImportResult>`

#### PerformanceMonitorService
- `recordMetric(metric: PerformanceMetric): void`
- `trackApiCall(url: string, method: string, startTime: number): Function`
- `getPerformanceSummary(): Observable<PerformanceSummary>`
- `getActiveAlerts(): Observable<PerformanceAlert[]>`

#### AdvancedSearchService
- `search<T>(data: T[], options: SearchOptions): Observable<SearchResponse<T>>`
- `getAutoCompleteSuggestions(query: string, data: any[]): Observable<string[]>`
- `getSearchHistory(): Observable<SearchHistoryItem[]>`
- `clearSearchHistory(): void`

#### BulkOperationsService
- `bulkDelete<T>(items: T[], deleteFunction: Function, config: BulkDeleteConfig): Observable<BulkOperation>`
- `bulkUpdate<T>(items: T[], updateData: Partial<T>, updateFunction: Function, config: BulkUpdateConfig): Observable<BulkOperation>`
- `cancelOperation(operationId: string): void`
- `getOperationStats(): OperationStats`

---

## Examples

### Complete Form Example
```typescript
@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [DynamicFormComponent],
  template: `
    <opena3xx-dynamic-form
      [config]="formConfig"
      (formSubmit)="onSubmit($event)"
      (formCancel)="onCancel()">
    </opena3xx-dynamic-form>
  `
})
export class UserFormComponent {
  formConfig = computed((): DynamicFormConfig => ({
    title: 'User Registration',
    fields: [
      {
        key: 'name',
        label: 'Full Name',
        type: 'text',
        required: true,
        validation: { required: true, minLength: 2 }
      },
      {
        key: 'email',
        label: 'Email',
        type: 'email',
        required: true,
        validation: { required: true, email: true }
      }
    ],
    submitText: 'Register',
    cancelText: 'Cancel'
  }));

  onSubmit(data: any): void {
    console.log('Form submitted:', data);
  }

  onCancel(): void {
    console.log('Form cancelled');
  }
}
```

### Dashboard Widget Example
```typescript
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [DashboardWidgetComponent],
  template: `
    <div class="dashboard-grid">
      <opena3xx-dashboard-widget
        [data]="systemStatusData"
        [config]="systemStatusConfig">
      </opena3xx-dashboard-widget>
      
      <opena3xx-dashboard-widget
        [data]="performanceData"
        [config]="performanceConfig">
      </opena3xx-dashboard-widget>
    </div>
  `
})
export class DashboardComponent {
  systemStatusData: WidgetData = {
    title: 'System Status',
    value: 'Online',
    status: 'success',
    icon: 'check_circle'
  };

  systemStatusConfig: WidgetConfig = {
    type: 'status',
    size: 'medium',
    refreshInterval: 5000
  };
}
```

---

## Troubleshooting

### Common Issues

1. **Build Errors**: Ensure all standalone components are removed from NgModule declarations
2. **Signal Errors**: Use `()` to access signal values in templates
3. **Import Errors**: Check that all required modules are imported in standalone components
4. **Type Errors**: Ensure proper TypeScript interfaces are defined
5. **Performance Issues**: Use OnPush change detection and optimize bundle size

### Debug Tips

1. **Use Angular DevTools**: Install Angular DevTools for debugging
2. **Check Console**: Monitor browser console for errors
3. **Use Source Maps**: Enable source maps for better debugging
4. **Test Incrementally**: Test changes incrementally
5. **Use TypeScript Strict**: Enable strict TypeScript checking

---

## Conclusion

This documentation provides a comprehensive guide to the OpenA3XX Configurator Admin application's components, services, and utilities. The application follows modern Angular patterns with standalone components, signals for reactive state management, and comprehensive testing infrastructure.

For additional support or questions, please refer to the Angular documentation or contact the development team. 
