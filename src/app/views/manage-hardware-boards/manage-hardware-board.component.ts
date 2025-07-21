import { Component } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { HardwareBoardDto } from 'src/app/models/models';
import { DataService } from 'src/app/services/data.service';

@Component({
  templateUrl: './manage-hardware-board.component.html',
  styleUrls: ['./manage-hardware-board.component.scss'],
  selector: 'opena3xx-manage-hardware-boards',
})
export class ManageHardwareBoardsComponent {
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

  constructor(private router: Router, private dataService: DataService) {
    firstValueFrom(this.dataService.getAllHardwareBoards())
      .then((data) => {
        this.data = data as HardwareBoardDto[];
        this.dataSource = new MatTableDataSource<HardwareBoardDto>(this.data);
        this.data_loaded = true;
      });
  }
  registerHardwareBoard() {
    this.router.navigateByUrl('/register/hardware-board');
  }

  onEditClick() {}
}
