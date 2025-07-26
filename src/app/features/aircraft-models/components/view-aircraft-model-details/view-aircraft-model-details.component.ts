import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AircraftModelService } from '../../services/aircraft-model.service';
import { AircraftModelDto } from 'src/app/shared/models/models';

@Component({
    selector: 'opena3xx-view-aircraft-model-details',
    templateUrl: './view-aircraft-model-details.component.html',
    styleUrls: ['./view-aircraft-model-details.component.scss'],
    standalone: false
})
export class ViewAircraftModelDetailsComponent implements OnInit {
  aircraftModel: AircraftModelDto | null = null;
  loading = false;
  aircraftModelId: number = 0;

  constructor(
    private aircraftModelService: AircraftModelService,
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.aircraftModelId = Number(params['id']);
      if (this.aircraftModelId) {
        this.loadAircraftModel();
      } else {
        this.snackBar.open('Invalid aircraft model ID', 'Close', { duration: 3000 });
        this.router.navigateByUrl('/manage/aircraft-models');
      }
    });
  }

  loadAircraftModel(): void {
    this.loading = true;
    this.aircraftModelService.getAircraftModelById(this.aircraftModelId).subscribe({
      next: (aircraftModel) => {
        this.aircraftModel = aircraftModel;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading aircraft model:', error);
        this.loading = false;
        this.snackBar.open('Error loading aircraft model', 'Close', { duration: 3000 });
        this.router.navigateByUrl('/manage/aircraft-models');
      }
    });
  }

  onEdit(): void {
    this.router.navigateByUrl(`/edit/aircraft-model?id=${this.aircraftModelId}`);
  }

  onBack(): void {
    this.router.navigateByUrl('/manage/aircraft-models');
  }

  onDelete(): void {
    // TODO: Add confirmation dialog
    if (confirm('Are you sure you want to delete this aircraft model?')) {
      this.aircraftModelService.deleteAircraftModel(this.aircraftModelId).subscribe({
        next: () => {
          this.snackBar.open('Aircraft model deleted successfully', 'Close', {
            duration: 3000
          });
          this.router.navigateByUrl('/manage/aircraft-models');
        },
        error: (error) => {
          console.error('Error deleting aircraft model:', error);
          this.snackBar.open('Error deleting aircraft model', 'Close', {
            duration: 3000
          });
        }
      });
    }
  }

  getStatusIcon(isActive: boolean): string {
    return isActive ? 'check_circle' : 'cancel';
  }

  getStatusColor(isActive: boolean): string {
    return isActive ? 'success' : 'warn';
  }

  getStatusText(isActive: boolean): string {
    return isActive ? 'Active' : 'Inactive';
  }

  formatDate(date: Date | undefined): string {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString();
  }
}
