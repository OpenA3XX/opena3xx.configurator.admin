import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatListModule } from '@angular/material/list';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HardwareInputDto, HardwareOutputDto, HardwarePanelDto } from '../../../../shared/models/models';
import { HardwareService } from '../../services/hardware.service';
import { ConfirmationDialogService } from '../../../../shared/services/confirmation-dialog.service';

@Component({
  selector: 'opena3xx-view-hardware-panel-details',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatChipsModule,
    MatExpansionModule,
    MatDividerModule,
    MatTooltipModule,
    MatMenuModule,
    MatPaginatorModule,
    MatListModule
  ],
  templateUrl: './view-hardware-panel-details.component.html',
  styleUrls: ['./view-hardware-panel-details.component.scss']
})
export class ViewHardwarePanelDetailsComponent implements OnInit {
  // Signals for reactive state management
  loading = signal(false);
  error = signal(false);
  hardwarePanel = signal<HardwarePanelDto | null>(null);
  hardwarePanelDto = signal<HardwarePanelDto | null>(null);
  showHardwareInputs = signal(true);
  showHardwareOutputs = signal(true);
  isEmpty = computed(() => !this.hardwarePanel() && !this.loading() && !this.error());

  // Table data
  displayedInputColumns: string[] = ['id', 'name', 'hardwareInputType', 'action'];
  displayedOutputColumns: string[] = ['id', 'name', 'hardwareOutputType', 'action'];

  // Page actions
  pageActions = signal<any[]>([
    {
      label: 'Edit',
      icon: 'edit',
      action: 'edit',
      color: 'primary'
    },
    {
      label: 'Delete',
      icon: 'delete',
      action: 'delete',
      color: 'warn'
    }
  ]);

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private hardwareService: HardwareService,
    private confirmationDialog: ConfirmationDialogService
  ) {}

  ngOnInit(): void {
    this.loadHardwarePanel();
  }

  onPageAction(action: string): void {
    switch (action) {
      case 'back':
        this.back();
        break;
      case 'edit':
        this.editHardwarePanel();
        break;
    }
  }

  private loadHardwarePanel(): void {
    this.loading.set(true);

    this.route.queryParams.subscribe(params => {
      const id = params['id'];
      if (id) {
        this.hardwareService.getPanelById(id).subscribe({
          next: (data) => {
            this.hardwarePanel.set(data);
            this.loading.set(false);
          },
          error: (error) => {
            console.error('Error loading hardware panel:', error);
            this.error.set(true);
            this.loading.set(false);
          }
        });
      } else {
        this.error.set(true);
        this.loading.set(false);
      }
    });
  }

  showInputSelectorDetails(data: HardwareInputDto): void {
    // Implementation for showing input selector details
    console.log('Show input selector details:', data);
  }

  mapInputSelector(data: HardwareInputDto): void {
    // Implementation for mapping input selector
    console.log('Map input selector:', data);
  }

  linkInputSelector(data: HardwareInputDto): void {
    // Implementation for linking input selector
    console.log('Link input selector:', data);
  }

  showOutputSelectorDetails(data: HardwareOutputDto): void {
    // Implementation for showing output selector details
    console.log('Show output selector details:', data);
  }

  mapOutputSelector(data: HardwareOutputDto): void {
    // Implementation for mapping output selector
    console.log('Map output selector:', data);
  }

  deleteHardwareInput(hardwareInput: HardwareInputDto): void {
    this.confirmationDialog.confirmDelete(
      hardwareInput.name,
      'hardware input'
    ).subscribe(confirmed => {
      if (confirmed) {
        // Implementation for deleting hardware input
        console.log('Delete hardware input:', hardwareInput);
      }
    });
  }

  deleteHardwareOutput(hardwareOutput: HardwareOutputDto): void {
    this.confirmationDialog.confirmDelete(
      hardwareOutput.name,
      'hardware output'
    ).subscribe(confirmed => {
      if (confirmed) {
        // Implementation for deleting hardware output
        console.log('Delete hardware output:', hardwareOutput);
      }
    });
  }

  private back(): void {
    this.router.navigateByUrl('/manage/hardware-panels');
  }

  private editHardwarePanel(): void {
    const panel = this.hardwarePanel();
    if (panel) {
      this.router.navigate(['/edit/hardware-panel'], { queryParams: { id: panel.id } });
    }
  }

  onEditHardwareDetails(): void {
    const panel = this.hardwarePanel();
    if (panel) {
      this.router.navigate(['/edit/hardware-panel'], { queryParams: { id: panel.id } });
    }
  }

  // Getters for template
  get panel(): HardwarePanelDto | null {
    return this.hardwarePanel();
  }

  get inputs(): HardwareInputDto[] {
    return this.panel?.hardwareInputs || [];
  }

  get outputs(): HardwareOutputDto[] {
    return this.panel?.hardwareOutputs || [];
  }

  get hasInputs(): boolean {
    return this.inputs.length > 0;
  }

  get hasOutputs(): boolean {
    return this.outputs.length > 0;
  }
}
