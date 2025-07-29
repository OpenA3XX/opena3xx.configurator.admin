import { Injectable } from '@angular/core';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { BehaviorSubject, of } from 'rxjs';

// Mock function type for testing
type MockFunction = (...args: any[]) => any;

export interface TestData {
  id: string;
  name: string;
  description?: string;
  category?: string;
  status?: string;
  createdAt?: Date;
  updatedAt?: Date;
  [key: string]: any;
}

export interface MockService {
  name: string;
  methods: { [key: string]: any };
  properties?: { [key: string]: any };
}

export interface TestScenario {
  name: string;
  setup: () => void;
  execute: () => void;
  verify: () => void;
  cleanup?: () => void;
}

export interface PerformanceTest {
  name: string;
  iterations: number;
  testFunction: () => void;
  expectedMaxTime?: number;
}

@Injectable({
  providedIn: 'root'
})
export class TestUtilityService {
  private testData: { [key: string]: TestData[] } = {};
  private mockServices: { [key: string]: MockService } = {};
  private testScenarios: TestScenario[] = [];
  private performanceTests: PerformanceTest[] = [];

  constructor() {
    this.initializeTestData();
  }

  // Test Data Management
  generateTestData(type: string, count: number, options: Partial<TestData> = {}): TestData[] {
    const data: TestData[] = [];

    for (let i = 1; i <= count; i++) {
      const item: TestData = {
        id: `${type}_${i}`,
        name: `${type} ${i}`,
        description: `Test ${type} description ${i}`,
        category: 'test',
        status: 'active',
        createdAt: new Date(),
        updatedAt: new Date(),
        ...options
      };
      data.push(item);
    }

    this.testData[type] = data;
    return data;
  }

  getTestData(type: string): TestData[] {
    return this.testData[type] || [];
  }

  clearTestData(type?: string): void {
    if (type) {
      delete this.testData[type];
    } else {
      this.testData = {};
    }
  }

  // Mock Service Management
  createMockService(name: string, methods: { [key: string]: any } = {}, properties: { [key: string]: any } = {}): MockService {
    const mockService: MockService = {
      name,
      methods,
      properties
    };

    this.mockServices[name] = mockService;
    return mockService;
  }

  getMockService(name: string): MockService | null {
    return this.mockServices[name] || null;
  }

  createHardwareServiceMock(): MockService {
    return this.createMockService('HardwareService', {
      getAllPanels: () => of(this.generateTestData('panel', 5)),
      getPanelById: (id: string) => of(this.generateTestData('panel', 1, { id })[0]),
      addPanel: (panel: any) => of({ ...panel, id: `panel_${Date.now()}` }),
      updatePanel: (id: string, panel: any) => of({ ...panel, id }),
      deletePanel: (id: string) => of(void 0),
      getAllInputTypes: () => of(this.generateTestData('inputType', 3)),
      addInputType: (inputType: any) => of({ ...inputType, id: `inputType_${Date.now()}` }),
      getAllOutputTypes: () => of(this.generateTestData('outputType', 3)),
      addOutputType: (outputType: any) => of({ ...outputType, id: `outputType_${Date.now()}` })
    });
  }

  createNotificationServiceMock(): MockService {
    return this.createMockService('NotificationService', {
      getNotifications: () => of([]),
      addNotification: (notification: any) => of(notification),
      markAsRead: (id: string) => of(void 0),
      clearAllNotifications: () => of(void 0)
    });
  }

  createPerformanceMonitorServiceMock(): MockService {
    return this.createMockService('PerformanceMonitorService', {
      getMetrics: () => of([]),
      getAlerts: () => of([]),
      recordMetric: (metric: any) => void 0,
      getPerformanceSummary: () => of({
        averageResponseTime: 150,
        errorRate: 0.5,
        memoryUsage: 45,
        activeAlerts: 0
      })
    });
  }

  // Component Testing Utilities
    createComponentFixture<T>(component: any, providers: any[] = []): ComponentFixture<T> {
    TestBed.configureTestingModule({
      declarations: [component],
      providers: [
        { provide: Router, useValue: { navigate: () => {} } },
        { provide: MatSnackBar, useValue: { open: () => {} } },
        { provide: MatDialog, useValue: { open: () => {} } },
        ...providers
      ]
    });

    return TestBed.createComponent(component);
  }

    createStandaloneComponentFixture<T>(component: any, imports: any[] = [], providers: any[] = []): ComponentFixture<T> {
    TestBed.configureTestingModule({
      imports: [
        component,
        ...imports
      ],
      providers: [
        { provide: Router, useValue: { navigate: () => {} } },
        { provide: MatSnackBar, useValue: { open: () => {} } },
        { provide: MatDialog, useValue: { open: () => {} } },
        ...providers
      ]
    });

    return TestBed.createComponent(component);
  }

  // Form Testing Utilities
  createFormTestData(): any {
    return {
      name: 'Test Item',
      description: 'Test Description',
      category: 'test',
      isActive: true,
      email: 'test@example.com',
      number: 42,
      date: new Date(),
      url: 'https://example.com'
    };
  }

  validateFormFields(form: any, expectedFields: string[]): boolean {
    const formControls = Object.keys(form.controls);
    return expectedFields.every(field => formControls.includes(field));
  }

  simulateFormInput(form: any, fieldName: string, value: any): void {
    const control = form.get(fieldName);
    if (control) {
      control.setValue(value);
      control.markAsTouched();
    }
  }

  // Dialog Testing Utilities
  createDialogTestData(): any {
    return {
      title: 'Test Dialog',
      message: 'This is a test dialog',
      confirmText: 'Confirm',
      cancelText: 'Cancel',
      data: { test: true }
    };
  }

    simulateDialogOpen(dialog: MatDialog, component: any, data: any = {}): any {
    const dialogRef = {
      afterClosed: () => of(true),
      close: () => {},
      componentInstance: {}
    };

    (dialog.open as any) = () => dialogRef;
    return dialogRef;
  }

  // Router Testing Utilities
  createRouterMock(): any {
    return {
      navigate: () => {},
      navigateByUrl: () => {},
      url: '/test',
      events: new BehaviorSubject({}),
      routerState: { snapshot: { url: '/test' } }
    };
  }

  // SnackBar Testing Utilities
  createSnackBarMock(): any {
    return {
      open: () => ({
        afterDismissed: () => of({ dismissedByAction: false })
      })
    };
  }

  // Service Testing Utilities
  createServiceTestBed(service: any, providers: any[] = []): any {
    TestBed.configureTestingModule({
      providers: [
        service,
        ...providers
      ]
    });

    return TestBed.inject(service);
  }

  // Async Testing Utilities
  async waitForAsync(condition: () => boolean, timeout: number = 5000): Promise<void> {
    const startTime = Date.now();

    while (!condition() && (Date.now() - startTime) < timeout) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    if (!condition()) {
      throw new Error('Async condition not met within timeout');
    }
  }

  // Performance Testing
  addPerformanceTest(test: PerformanceTest): void {
    this.performanceTests.push(test);
  }

  runPerformanceTests(): { [key: string]: { averageTime: number; maxTime: number; minTime: number } } {
    const results: { [key: string]: any } = {};

    this.performanceTests.forEach(test => {
      const times: number[] = [];

      for (let i = 0; i < test.iterations; i++) {
        const startTime = performance.now();
        test.testFunction();
        const endTime = performance.now();
        times.push(endTime - startTime);
      }

      const averageTime = times.reduce((sum, time) => sum + time, 0) / times.length;
      const maxTime = Math.max(...times);
      const minTime = Math.min(...times);

      results[test.name] = {
        averageTime,
        maxTime,
        minTime,
        passed: !test.expectedMaxTime || maxTime <= test.expectedMaxTime
      };
    });

    return results;
  }

  // Test Scenario Management
  addTestScenario(scenario: TestScenario): void {
    this.testScenarios.push(scenario);
  }

  runTestScenarios(): { [key: string]: { passed: boolean; error?: string } } {
    const results: { [key: string]: any } = {};

    this.testScenarios.forEach(scenario => {
      try {
        scenario.setup();
        scenario.execute();
        scenario.verify();
        scenario.cleanup?.();

        results[scenario.name] = { passed: true };
      } catch (error) {
        results[scenario.name] = {
          passed: false,
          error: error instanceof Error ? error.message : 'Unknown error'
        };
      }
    });

    return results;
  }

  // E2E Testing Utilities
  createE2ETestData(): any {
    return {
      user: {
        username: 'testuser',
        email: 'test@example.com',
        role: 'admin'
      },
      hardware: {
        panels: this.generateTestData('panel', 3),
        inputTypes: this.generateTestData('inputType', 2),
        outputTypes: this.generateTestData('outputType', 2)
      },
      settings: {
        theme: 'light',
        language: 'en',
        notifications: true
      }
    };
  }

  // Mock HTTP Responses
  createMockHttpResponse(data: any, status: number = 200): any {
    return {
      body: data,
      status,
      statusText: status === 200 ? 'OK' : 'Error',
      ok: status >= 200 && status < 300
    };
  }

  createMockErrorResponse(error: string, status: number = 400): any {
    return {
      error: { message: error },
      status,
      statusText: 'Error',
      ok: false
    };
  }

  // Validation Testing
  validateComponentStructure(component: any, expectedProperties: string[]): boolean {
    return expectedProperties.every(prop => prop in component);
  }

  validateServiceMethods(service: any, expectedMethods: string[]): boolean {
    return expectedMethods.every(method => typeof service[method] === 'function');
  }

  // Cleanup
  cleanup(): void {
    this.clearTestData();
    this.mockServices = {};
    this.testScenarios = [];
    this.performanceTests = [];
  }

  // Private methods
  private initializeTestData(): void {
    // Initialize with some default test data
    this.generateTestData('panel', 3);
    this.generateTestData('inputType', 2);
    this.generateTestData('outputType', 2);
    this.generateTestData('aircraftModel', 2);
  }
}
