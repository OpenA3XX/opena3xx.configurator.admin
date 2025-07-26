import { Component, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { HardwareBoardDto } from 'src/app/shared/models/models';
import { DataService } from 'src/app/core/services/data.service';

@Component({
  templateUrl: './manage-hardware-board.component.html',
  styleUrls: ['./manage-hardware-board.component.scss'],
  selector: 'opena3xx-manage-hardware-boards',
})
export class ManageHardwareBoardsComponent implements AfterViewInit, OnDestroy {
  public displayedColumns: string[] = [
    'id',
    'name',
    'hardwareBusExtendersCount',
    'totalInputOutputs',
    'details',
  ];
  dataSource = new MatTableDataSource<HardwareBoardDto>();
  public data: HardwareBoardDto[];
  public data_loaded: boolean = false;

  @ViewChild(MatSort) sort: MatSort;

  constructor(private router: Router, private dataService: DataService) {
    this.loadData();
  }

  ngAfterViewInit() {
    console.log('Hardware Boards - ngAfterViewInit - Sort available:', !!this.sort);
    this.dataSource.sort = this.sort;
    if (this.sort) {
      console.log('Hardware Boards - Sort connected successfully');
    } else {
      console.warn('Hardware Boards - Sort not available in ngAfterViewInit');
    }
  }

  ngOnDestroy(): void {
    // Clean up ViewChild references
    if (this.dataSource) {
      this.dataSource.disconnect();
    }
  }

  private loadData() {
    firstValueFrom(this.dataService.getAllHardwareBoards())
      .then((data) => {
        this.data = data as HardwareBoardDto[];
        this.dataSource = new MatTableDataSource<HardwareBoardDto>(this.data);
        this.data_loaded = true;

        // Connect sort after view init if available
        if (this.sort) {
          this.dataSource.sort = this.sort;
        }
      });
  }

  registerHardwareBoard() {
    this.router.navigateByUrl('/register/hardware-board');
  }

  onEditClick() {}

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}
