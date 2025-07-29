import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatMenuModule } from '@angular/material/menu';
import { MatExpansionModule } from '@angular/material/expansion';
import { PageLayoutComponent, ActionButton } from '../../../../shared/components/layout/page-layout.component';
import { LoadingWrapperComponent } from '../../../../shared/components/ui/loading-wrapper/loading-wrapper.component';

export interface DiagnosticTest {
  id: string;
  name: string;
  description: string;
  category: 'network' | 'hardware' | 'system' | 'performance';
  status: 'idle' | 'running' | 'completed' | 'failed';
  progress?: number;
  result?: any;
  duration?: number;
  lastRun?: Date;
}

export interface DiagnosticResult {
  testId: string;
  status: 'pass' | 'fail' | 'warning';
  message: string;
  details?: any;
  timestamp: Date;
}

@Component({
  selector: 'opena3xx-diagnostic-tools',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatChipsModule,
    MatProgressBarModule,
    MatTooltipModule,
    MatMenuModule,
    MatExpansionModule,
    PageLayoutComponent,
    LoadingWrapperComponent
  ],
  templateUrl: './diagnostic-tools.component.html',
  styleUrls: ['./diagnostic-tools.component.scss']
})
export class DiagnosticToolsComponent implements OnInit {
  // Signals for reactive state management
  loading = signal(false);
  error = signal(false);
  tests = signal<DiagnosticTest[]>([]);
  results = signal<DiagnosticResult[]>([]);
  selectedTests = signal<string[]>([]);

  // Computed properties
  runningTests = computed(() => this.tests().filter(t => t.status === 'running'));
  completedTests = computed(() => this.tests().filter(t => t.status === 'completed'));
  failedTests = computed(() => this.tests().filter(t => t.status === 'failed'));

  isEmpty = computed(() => this.tests().length === 0 && !this.loading() && !this.error());

  // Page actions
  pageActions = signal<ActionButton[]>([
    {
      label: 'Run All Tests',
      icon: 'play_arrow',
      action: 'run-all',
      color: 'primary'
    },
    {
      label: 'Stop Tests',
      icon: 'stop',
      action: 'stop-tests',
      color: 'warn'
    },
    {
      label: 'Export Results',
      icon: 'download',
      action: 'export-results',
      color: 'accent'
    }
  ]);

  constructor() {}

  ngOnInit(): void {
    this.loadDiagnosticTests();
  }

  async loadDiagnosticTests(): Promise<void> {
    this.loading.set(true);
    this.error.set(false);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      const tests: DiagnosticTest[] = [
        {
          id: '1',
          name: 'Network Connectivity',
          description: 'Test network connectivity to all devices',
          category: 'network',
          status: 'idle',
          lastRun: new Date(Date.now() - 3600000)
        },
        {
          id: '2',
          name: 'Hardware Response',
          description: 'Test hardware panel response times',
          category: 'hardware',
          status: 'idle',
          lastRun: new Date(Date.now() - 7200000)
        },
        {
          id: '3',
          name: 'System Performance',
          description: 'Check system CPU and memory usage',
          category: 'system',
          status: 'idle',
          lastRun: new Date(Date.now() - 1800000)
        },
        {
          id: '4',
          name: 'Data Throughput',
          description: 'Measure data transfer rates',
          category: 'performance',
          status: 'idle',
          lastRun: new Date(Date.now() - 5400000)
        }
      ];
      this.tests.set(tests);
    } catch (err) {
      console.error('Error loading diagnostic tests:', err);
      this.error.set(true);
    } finally {
      this.loading.set(false);
    }
  }

  onTestSelectionChange(selectedIds: string[]): void {
    this.selectedTests.set(selectedIds);
  }

  runTest(testId: string): void {
    console.log('Running test:', testId);
    this.tests.update(tests =>
      tests.map(t => t.id === testId ? { ...t, status: 'running', progress: 0 } : t)
    );

    // Simulate test execution
    this.simulateTestExecution(testId);
  }

  runAllTests(): void {
    console.log('Running all tests...');
    this.tests.update(tests =>
      tests.map(t => ({ ...t, status: 'running', progress: 0 }))
    );

    // Simulate running all tests
    this.tests().forEach(test => this.simulateTestExecution(test.id));
  }

  stopTests(): void {
    console.log('Stopping all tests...');
    this.tests.update(tests =>
      tests.map(t => t.status === 'running' ? { ...t, status: 'idle', progress: 0 } : t)
    );
  }

  exportResults(): void {
    console.log('Exporting diagnostic results...');
    // Implement export functionality
  }

  private simulateTestExecution(testId: string): void {
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 20;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);

        this.tests.update(tests =>
          tests.map(t => t.id === testId ? {
            ...t,
            status: 'completed',
            progress: 100,
            duration: Math.floor(Math.random() * 30) + 10,
            lastRun: new Date()
          } : t)
        );

        // Add result
        const result: DiagnosticResult = {
          testId,
          status: Math.random() > 0.2 ? 'pass' : 'fail',
          message: `Test ${testId} completed successfully`,
          timestamp: new Date()
        };

        this.results.update(results => [...results, result]);
      } else {
        this.tests.update(tests =>
          tests.map(t => t.id === testId ? { ...t, progress } : t)
        );
      }
    }, 500);
  }

  onPageAction(action: string): void {
    switch (action) {
      case 'run-all':
        this.runAllTests();
        break;
      case 'stop-tests':
        this.stopTests();
        break;
      case 'export-results':
        this.exportResults();
        break;
      default:
        console.log(`Unknown action: ${action}`);
    }
  }

  // Getters for template
  get testList(): DiagnosticTest[] {
    return this.tests();
  }

  get resultList(): DiagnosticResult[] {
    return this.results();
  }

  get pageActionButtons(): ActionButton[] {
    return this.pageActions();
  }

  get isLoading(): boolean {
    return this.loading();
  }

  get hasError(): boolean {
    return this.error();
  }

  get isEmptyState(): boolean {
    return this.isEmpty();
  }

  get runningTestCount(): number {
    return this.runningTests().length;
  }

  get completedTestCount(): number {
    return this.completedTests().length;
  }

  get failedTestCount(): number {
    return this.failedTests().length;
  }

  get hasSelectedTests(): boolean {
    return this.selectedTests().length > 0;
  }

  get categoryOptions(): { value: string; label: string }[] {
    return [
      { value: 'all', label: 'All Categories' },
      { value: 'network', label: 'Network' },
      { value: 'hardware', label: 'Hardware' },
      { value: 'system', label: 'System' },
      { value: 'performance', label: 'Performance' }
    ];
  }
}
