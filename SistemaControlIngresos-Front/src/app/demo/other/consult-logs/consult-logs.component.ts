// angular import
import { Component, ViewChild } from '@angular/core';

import { LogService } from 'src/app/services/logs-service/log.service';

// project import
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { NzTableModule, NzTableComponent, NzFilterTriggerComponent, NzTableSortFn } from 'ng-zorro-antd/table';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSwitchModule } from 'ng-zorro-antd/switch';

import { FormsModule } from '@angular/forms';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzTimePickerModule } from 'ng-zorro-antd/time-picker';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzSelectModule } from 'ng-zorro-antd/select';
import Swal from 'sweetalert2';

interface DataItem {
  id: string,
  user: string;
  status: string;
}
@Component({
  selector: 'app-consult-logs',
  standalone: true,
  imports: [SharedModule, NzTableComponent, NzFilterTriggerComponent, NzDropDownModule,
    NzTableModule, NzIconModule, NzButtonModule, NzInputModule, NzSwitchModule
    , FormsModule, NzFormModule, NzDatePickerModule, NzTimePickerModule, NzInputNumberModule,
    NzSelectModule, ReactiveFormsModule],
  templateUrl: './consult-logs.html',
  styleUrls: ['./consult-logs.component.scss']
})
export default class ConsultLogsComponent {

  //LIST FOR ATTENDANTS -- REMEMBER CALL THE SERVICE ON THE CSTR
  listOfData: any[] = [];
  listOfDisplayData = [...this.listOfData];

  //CONSTRUCTOR
  constructor(private fb: FormBuilder,
    private service: LogService) {

    this.service.getAllLogs().subscribe(listOfData => {
      console.log(listOfData)
      this.listOfData = listOfData;
      this.listOfDisplayData = [...this.listOfData];
    });
  }

  //SEARCH BY NAME
  searchValue = '';
  visible = false;

  reset(): void {
    this.searchValue = '';
    this.search();
  }

  search(): void {
    this.visible = false;
    this.listOfDisplayData = this.listOfData.filter((item: DataItem) => item.user.indexOf(this.searchValue) !== -1);
  }




}
