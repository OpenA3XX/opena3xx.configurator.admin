import { Component, OnInit, OnDestroy, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { PageLayoutComponent, ActionButton } from '../../../../shared/components/layout/page-layout.component';
import { LoadingWrapperComponent } from '../../../../shared/components/ui/loading-wrapper/loading-wrapper.component';
import { ConfigurationService } from '../../../../core/services/configuration.service';
import { HttpClient } from '@angular/common/http';
import { Subject, takeUntil } from 'rxjs';

interface ConfigurationEntry {
  key: string;
  value: string;
}

@Component({
  selector: 'opena3xx-settings',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    PageLayoutComponent,
    LoadingWrapperComponent
  ],
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit, OnDestroy {
  // Signals for reactive state management
  configuration = signal<Record<string, string>>({});
  loading = signal(false);
  error = signal(false);
  saving = signal(false);
  formReady = signal(false);

  private destroy$ = new Subject<void>();

  // Form
  settingsForm: FormGroup;

  // Computed properties
  configurationEntries = computed(() => {
    const config = this.configuration();
    const isFormReady = this.formReady();

    console.log('configurationEntries computed - config:', config);
    console.log('configurationEntries computed - isFormReady:', isFormReady);
    console.log('configurationEntries computed - config keys length:', Object.keys(config).length);

    // Only return entries if form is ready
    if (!isFormReady || !config || Object.keys(config).length === 0) {
      console.log('configurationEntries computed - returning empty array');
      return [];
    }

    const entries = Object.entries(config).map(([key, value]) => ({
      key,
      value: value || ''
    }));

    console.log('configurationEntries computed - returning entries:', entries);
    return entries;
  });

  // Getter for template access
  get configEntries() {
    const entries = this.configurationEntries();
    console.log('configEntries getter called, returning:', entries);
    return entries;
  }

  pageActions: ActionButton[] = [
    {
      label: 'Refresh',
      icon: 'refresh',
      action: 'refresh',
      color: 'primary'
    }
  ];

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private configurationService: ConfigurationService,
    private snackBar: MatSnackBar,
    private router: Router,
    private dialog: MatDialog
  ) {
    // Initialize with empty form to prevent NG0901 error
    this.settingsForm = this.fb.group({});
  }

  ngOnInit(): void {
    this.loadConfiguration();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadConfiguration(): void {
    this.loading.set(true);
    this.error.set(false);

    const apiBaseUrl = this.configurationService.getApiBaseUrl();

    this.http.get<Record<string, string>>(`${apiBaseUrl}/configuration`)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (config) => {
          console.log('Configuration loaded:', config);
          console.log('About to set configuration signal and build form');
          this.configuration.set(config);
          this.buildForm(config);
          this.loading.set(false);
          this.snackBar.open('Configuration loaded successfully', 'Close', {
            duration: 2000
          });
        },
        error: (error) => {
          console.error('Error loading configuration:', error);
          this.error.set(true);
          this.loading.set(false);
          this.snackBar.open('Error loading configuration', 'Close', {
            duration: 3000
          });
        }
      });
  }

  private buildForm(config: Record<string, string>): void {
    console.log('buildForm called with config:', config);
    console.log('buildForm - config keys:', Object.keys(config));

    const formControls: Record<string, any> = {};

    Object.entries(config).forEach(([key, value]) => {
      formControls[key] = [value || ''];
    });

    console.log('buildForm - formControls:', formControls);

    // Rebuild the form with new controls
    this.settingsForm = this.fb.group(formControls);
    console.log('buildForm - form created:', this.settingsForm);
    console.log('buildForm - setting formReady to true');
    this.formReady.set(true);
    console.log('buildForm - formReady set to:', this.formReady());
  }

  formatSettingLabel(key: string): string {
    // Convert kebab-case to Title Case and remove opena3xx prefix
    return key
      .replace(/^opena3xx-/, '')
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  saveSettings(): void {
    if (this.settingsForm.valid && this.settingsForm.dirty) {
      this.saving.set(true);

      const formValue = this.settingsForm.value;
      const apiBaseUrl = this.configurationService.getApiBaseUrl();

      this.http.put(`${apiBaseUrl}/configuration`, formValue)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response) => {
            console.log('Configuration saved:', response);
            this.saving.set(false);
            this.settingsForm.markAsPristine();
            this.snackBar.open('Settings saved successfully', 'Close', {
              duration: 2000
            });
          },
          error: (error) => {
            console.error('Error saving configuration:', error);
            this.saving.set(false);
            this.snackBar.open('Error saving settings', 'Close', {
              duration: 3000
            });
          }
        });
    }
  }

  resetForm(): void {
    const config = this.configuration();
    this.formReady.set(false);
    this.buildForm(config);
    this.snackBar.open('Form reset to original values', 'Close', {
      duration: 2000
    });
  }

  onPageAction(action: string): void {
    switch (action) {
      case 'refresh':
        this.loadConfiguration();
        break;
    }
  }

  onRetry(): void {
    this.loadConfiguration();
  }
}
