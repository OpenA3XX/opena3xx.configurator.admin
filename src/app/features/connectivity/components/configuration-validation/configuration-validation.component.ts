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

export interface ValidationRule {
  id: string;
  name: string;
  description: string;
  category: 'hardware' | 'network' | 'system' | 'security';
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'pass' | 'fail' | 'warning' | 'pending';
  message?: string;
  details?: any;
  lastChecked?: Date;
}

export interface ValidationResult {
  totalRules: number;
  passedRules: number;
  failedRules: number;
  warningRules: number;
  pendingRules: number;
  overallStatus: 'valid' | 'invalid' | 'warning';
  lastValidation: Date;
}

@Component({
  selector: 'opena3xx-configuration-validation',
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
  templateUrl: './configuration-validation.component.html',
  styleUrls: ['./configuration-validation.component.scss']
})
export class ConfigurationValidationComponent implements OnInit {
  // Signals for reactive state management
  loading = signal(false);
  error = signal(false);
  rules = signal<ValidationRule[]>([]);
  result = signal<ValidationResult | null>(null);
  filters = signal({
    category: 'all',
    severity: 'all',
    status: 'all'
  });

  // Computed properties
  filteredRules = computed(() => {
    let filtered = this.rules();

    if (this.filters().category !== 'all') {
      filtered = filtered.filter(r => r.category === this.filters().category);
    }

    if (this.filters().severity !== 'all') {
      filtered = filtered.filter(r => r.severity === this.filters().severity);
    }

    if (this.filters().status !== 'all') {
      filtered = filtered.filter(r => r.status === this.filters().status);
    }

    return filtered;
  });

  isEmpty = computed(() => this.filteredRules().length === 0 && !this.loading() && !this.error());

  // Page actions
  pageActions = signal<ActionButton[]>([
    {
      label: 'Run Validation',
      icon: 'play_arrow',
      action: 'run-validation',
      color: 'primary'
    },
    {
      label: 'Export Report',
      icon: 'download',
      action: 'export-report',
      color: 'accent'
    },
    {
      label: 'Fix Issues',
      icon: 'build',
      action: 'fix-issues',
      color: 'warn'
    }
  ]);

  constructor() {}

  ngOnInit(): void {
    this.loadValidationRules();
  }

  async loadValidationRules(): Promise<void> {
    this.loading.set(true);
    this.error.set(false);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      const rules: ValidationRule[] = [
        {
          id: '1',
          name: 'Hardware Panel Configuration',
          description: 'Validate hardware panel configuration settings',
          category: 'hardware',
          severity: 'high',
          status: 'pass',
          message: 'All hardware panels are properly configured',
          lastChecked: new Date()
        },
        {
          id: '2',
          name: 'Network Connectivity',
          description: 'Check network connectivity and routing',
          category: 'network',
          severity: 'critical',
          status: 'pass',
          message: 'Network connectivity is stable',
          lastChecked: new Date()
        },
        {
          id: '3',
          name: 'Security Protocols',
          description: 'Validate security protocol implementations',
          category: 'security',
          severity: 'critical',
          status: 'warning',
          message: 'Some security protocols need attention',
          lastChecked: new Date()
        },
        {
          id: '4',
          name: 'System Performance',
          description: 'Check system performance metrics',
          category: 'system',
          severity: 'medium',
          status: 'fail',
          message: 'Performance below expected thresholds',
          lastChecked: new Date()
        }
      ];

      const result: ValidationResult = {
        totalRules: rules.length,
        passedRules: rules.filter(r => r.status === 'pass').length,
        failedRules: rules.filter(r => r.status === 'fail').length,
        warningRules: rules.filter(r => r.status === 'warning').length,
        pendingRules: rules.filter(r => r.status === 'pending').length,
        overallStatus: 'warning',
        lastValidation: new Date()
      };

      this.rules.set(rules);
      this.result.set(result);
    } catch (err) {
      console.error('Error loading validation rules:', err);
      this.error.set(true);
    } finally {
      this.loading.set(false);
    }
  }

  onFiltersChange(filters: any): void {
    this.filters.set(filters);
  }

  runValidation(): void {
    console.log('Running configuration validation...');
    this.loading.set(true);

    // Simulate validation process
    setTimeout(() => {
      this.rules.update(rules =>
        rules.map(rule => ({
          ...rule,
          status: Math.random() > 0.3 ? 'pass' : (Math.random() > 0.5 ? 'warning' : 'fail'),
          lastChecked: new Date()
        }))
      );

      this.updateValidationResult();
      this.loading.set(false);
    }, 2000);
  }

  private updateValidationResult(): void {
    const rules = this.rules();
    const result: ValidationResult = {
      totalRules: rules.length,
      passedRules: rules.filter(r => r.status === 'pass').length,
      failedRules: rules.filter(r => r.status === 'fail').length,
      warningRules: rules.filter(r => r.status === 'warning').length,
      pendingRules: rules.filter(r => r.status === 'pending').length,
      overallStatus: this.calculateOverallStatus(rules),
      lastValidation: new Date()
    };

    this.result.set(result);
  }

  private calculateOverallStatus(rules: ValidationRule[]): 'valid' | 'invalid' | 'warning' {
    const hasFailures = rules.some(r => r.status === 'fail');
    const hasWarnings = rules.some(r => r.status === 'warning');

    if (hasFailures) return 'invalid';
    if (hasWarnings) return 'warning';
    return 'valid';
  }

  exportReport(): void {
    console.log('Exporting validation report...');
    // Implement export functionality
  }

  fixIssues(): void {
    console.log('Opening issue fixer...');
    // Open issue fixer dialog
  }

  onPageAction(action: string): void {
    switch (action) {
      case 'run-validation':
        this.runValidation();
        break;
      case 'export-report':
        this.exportReport();
        break;
      case 'fix-issues':
        this.fixIssues();
        break;
      default:
        console.log(`Unknown action: ${action}`);
    }
  }

  // Getters for template
  get ruleList(): ValidationRule[] {
    return this.filteredRules();
  }

  get validationResult(): ValidationResult | null {
    return this.result();
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

  get categoryOptions(): { value: string; label: string }[] {
    return [
      { value: 'all', label: 'All Categories' },
      { value: 'hardware', label: 'Hardware' },
      { value: 'network', label: 'Network' },
      { value: 'system', label: 'System' },
      { value: 'security', label: 'Security' }
    ];
  }

  get severityOptions(): { value: string; label: string }[] {
    return [
      { value: 'all', label: 'All Severities' },
      { value: 'low', label: 'Low' },
      { value: 'medium', label: 'Medium' },
      { value: 'high', label: 'High' },
      { value: 'critical', label: 'Critical' }
    ];
  }

  get statusOptions(): { value: string; label: string }[] {
    return [
      { value: 'all', label: 'All Status' },
      { value: 'pass', label: 'Pass' },
      { value: 'fail', label: 'Fail' },
      { value: 'warning', label: 'Warning' },
      { value: 'pending', label: 'Pending' }
    ];
  }

  get severityIcon(): (severity: string) => string {
    return (severity: string) => {
      switch (severity) {
        case 'critical': return 'error';
        case 'high': return 'warning';
        case 'medium': return 'info';
        case 'low': return 'check_circle';
        default: return 'help';
      }
    };
  }

  get statusIcon(): (status: string) => string {
    return (status: string) => {
      switch (status) {
        case 'pass': return 'check_circle';
        case 'fail': return 'error';
        case 'warning': return 'warning';
        case 'pending': return 'pending';
        default: return 'help';
      }
    };
  }
}
