// angular import
import { Component } from '@angular/core';

// project import
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { NzTableModule, NzTableComponent, NzFilterTriggerComponent } from 'ng-zorro-antd/table';
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
import { AuthService } from '../../authentication/login/authService';
import { EarningService } from 'src/app/services/earning-service/earning.service';
import { ProjectService } from 'src/app/services/project-service/project.service';
import { LogService } from 'src/app/services/logs-service/log.service';

interface DataItem {
  id_earning: number,
  name: string;
  sector: string;
  legal_id: string;
  id_type: string;
  name_type: string;
  status: string;
}
@Component({
  selector: 'app-consult-project-page',
  standalone: true,
  imports: [SharedModule, NzTableComponent, NzFilterTriggerComponent, NzDropDownModule,
    NzTableModule, NzIconModule, NzButtonModule, NzInputModule, NzSwitchModule
    , FormsModule, NzFormModule, NzDatePickerModule, NzTimePickerModule, NzInputNumberModule,
    NzSelectModule, ReactiveFormsModule],
  templateUrl: './consult-project-page.html',
  styleUrls: ['./consult-project-page.component.scss']
})
export default class ConsultProjectComponent {

  type_mount = [
    { label: 'Dólares', value: 'USD' },
    { label: 'Colones', value: 'CRC' }
  ];

  //LIST FOR ATTENDANTS -- REMEMBER CALL THE SERVICE ON THE CSTR
  listOfData: any[] = [];
  listOfDisplayData = [...this.listOfData];

  projectList: any[] = [];
  rol = ""
  user = ""


  constructor(private fb: FormBuilder,
    private authService: AuthService,
    private serviceProject: ProjectService,
    private serviceEarnings: EarningService,
    private logService: LogService) {

    this.serviceEarnings.getAllEarning().subscribe(listOfData => {
      this.listOfData = listOfData;
      this.listOfDisplayData = [...this.listOfData];
    });
    this.projectForm = this.fb.group({
      projectId: ['', Validators.required],
      type_mount: ['', Validators.required],
      dolar_value: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
      earning: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
      earningDate: ['', Validators.required],
    });
    this.rol = this.authService.getRole();
    this.user = this.authService.getEmail();
    this.serviceProject.getAllProject().subscribe(projectList => {
      this.projectList = projectList;
    });
  }

  ngOnInit(): void {
    // Escucha cambios en el select del tipo de monto
    this.projectForm.get('type_mount')?.valueChanges.subscribe((selectedValue) => {
      this.onTypeMountChange(selectedValue);
    });
  }

  onTypeMountChange(selectedValue: string): void {
    if (selectedValue === 'USD') {
      this.projectForm.get('dolar_value')?.setValue('');
    } else if (selectedValue === 'CRC') {
      this.projectForm.get('dolar_value')?.setValue(0);
    }
  }

  //FORM
  projectForm: FormGroup;

  onSubmit(): void {
    if (this.projectForm.valid) {
      this.serviceEarnings.insertEarningAsync({
        id_transaction: this.projectForm.value.projectId,
        type_mount: this.projectForm.value.type_mount,
        dolar_value: this.projectForm.value.dolar_value,
        earning_mount: this.projectForm.value.earning,
        date_earning: new Date(this.projectForm.value.earningDate).toISOString(),
      }).subscribe(message => {
        if (message.result == true) {
          Swal.fire({
            position: "center",
            icon: "success",
            title: "¡Registro completo!",
            showConfirmButton: false,
            timer: 1500
          });
          const today: Date = new Date();
          this.logService.insertLogsAsync({
            description: "***Transacción de Ingreso:" + this.projectForm.value.type_mount + '/'
              + this.projectForm.value.dolar_value + '/' + this.projectForm.value.earning + '/' +
              this.projectForm.value.earningDate,
            user: this.user,
            date: today.toISOString()
          }).subscribe(message => { });
          this.serviceEarnings.getAllEarning().subscribe(listOfData => {
            this.listOfData = listOfData;
            this.listOfDisplayData = [...this.listOfData];
          });
          this.projectForm.reset();
        }
        if (message.result == false) {
          Swal.fire({
            position: "center",
            icon: "error",
            title: "Por favor, complete los campos correctamente.",
            showConfirmButton: false,
            timer: 1500
          });
        }


      });

    } else {
      Swal.fire({
        position: "center",
        icon: "error",
        title: "Error.",
        showConfirmButton: false,
        timer: 1500
      });
    }
  }

  onClear(): void {
    this.projectForm.reset();
  }

  //EDIT NAME
  async editClient(id_earning: string): Promise<void> {
    const item = this.listOfData.find(item => item.id_earning === id_earning);

    const projectOptions = this.projectList.map(option =>
      `<option value="${option.id_project}" ${option.id_project === item.id_transaction ? 'selected' : ''}>${option.id_project
      + ' - ' + option.client_name + ' - ' + option.project_year + ' - ' + option.type_mount}</option>`
    ).join('');

    const typeOptions = this.type_mount.map(type =>
      `<option value="${type.value}" ${type.value === item.type_mount ? 'selected' : ''}>${type.label}</option>`
    ).join('');

    const formatDate = (dateString) => {
      if (!dateString) return ''; // Si no hay fecha, retorna una cadena vacía
      const date = new Date(dateString);
      const year = date.getFullYear();
      const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Mes en formato 2 dígitos
      const day = date.getDate().toString().padStart(2, '0'); // Día en formato 2 dígitos
      return `${year}-${month}-${day}`;
    };

    const dateEarningFormatted = formatDate(item.date_earning);

    Swal.fire({
      title: 'Modificar Datos',
      html:
        `<select id="swal-input1" class="swal2-input">${projectOptions}</select>` +
        `<select id="swal-input2" class="swal2-input">${typeOptions}</select>` +
        `<input id="swal-input3" class="swal2-input" value="${item.dolar_value}">` +
        `<input id="swal-input4" class="swal2-input" value="${item.earning_mount}">` +
        `<input type="date" id="swal-input5" class="swal2-input" value="${dateEarningFormatted}">`,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: 'ACEPTAR',
      cancelButtonText: 'CANCELAR',
      preConfirm: () => {
        return {
          projectOptions: (document.getElementById('swal-input1') as HTMLInputElement).value,
          type_mount: (document.getElementById('swal-input2') as HTMLInputElement).value,
          dolar_value: (document.getElementById('swal-input3') as HTMLInputElement).value,
          earning_mount: (document.getElementById('swal-input4') as HTMLInputElement).value,
          dateEarningFormatted: (document.getElementById('swal-input5') as HTMLInputElement).value,
        };
      }
    }).then((result) => {
      if (result.isConfirmed) {

        this.serviceEarnings.updateEarningAsync({
          id_earning: item.id_earning,
          id_transaction: result.value.projectOptions,
          type_mount: result.value.type_mount,
          dolar_value: result.value.dolar_value,
          earning_mount: result.value.earning_mount,
          date_earning: new Date(result.value.dateEarningFormatted).toISOString(),
        }).subscribe(
          message => {
            if (message.result == true) {
              Swal.fire({
                icon: 'success',
                title: 'Modificación exitosa',
                text: 'El registro ha sido actualizado!',
                showConfirmButton: false,
                timer: 1500
              });
              const today: Date = new Date();
              this.logService.insertLogsAsync({
                description: "***Modificación Transacción de Ingreso:" + result.value.type_mount + '/'
                  + result.value.dolar_value + '/' + result.value.earning_mount + '/' +
                  result.value.dateEarningFormatted,
                user: this.user,
                date: today.toISOString()
              }).subscribe(message => { });
              this.serviceEarnings.getAllEarning().subscribe(listOfData => {
                this.listOfData = listOfData;
                this.listOfDisplayData = [...this.listOfData];
              });
            }
            if (message.result == false) {
              Swal.fire({
                position: "center",
                icon: "error",
                title: "Por favor, complete el campo de nombre correctamente.",
                showConfirmButton: false,
                timer: 1500
              });
            }
          });
      }
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
    this.listOfDisplayData = this.listOfData.filter((item: DataItem) =>
      item.id_earning.toString().indexOf(this.searchValue.toString()) !== -1
    );
  }

  async deleteEarning(id_earning: string): Promise<void> {
    const item = this.listOfData.find(item => item.id_earning === id_earning);

    Swal.fire({
      title: "¿Está seguro de eliminar el registro?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "SI",
      cancelButtonText: "NO"
    }).then((result) => {
      if (result.isConfirmed) {

        this.serviceEarnings.deleteEarningAsync(item.id_earning).subscribe(
          message => {
            if (message.result == true) {
              Swal.fire({
                icon: 'success',
                title: 'Eliminación exitosa',
                text: 'El registro ha sido eliminado!',
                showConfirmButton: false,
                timer: 1500
              });
              const formatDate = (dateString) => {
                if (!dateString) return ''; // Si no hay fecha, retorna una cadena vacía
                const date = new Date(dateString);
                const year = date.getFullYear();
                const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Mes en formato 2 dígitos
                const day = date.getDate().toString().padStart(2, '0'); // Día en formato 2 dígitos
                return `${year}-${month}-${day}`;
              };

              const dateEarningFormatted = formatDate(item.date_earning);

              const today: Date = new Date();
              this.logService.insertLogsAsync({
                description: "***Eliminación Transacción de Ingreso:" + item.type_mount + '/'
                  + item.dolar_value + '/' + item.earning_mount + '/' +
                  dateEarningFormatted,
                user: this.user,
                date: today.toISOString()
              }).subscribe(message => { });
              this.serviceEarnings.getAllEarning().subscribe(listOfData => {
                this.listOfData = listOfData;
                this.listOfDisplayData = [...this.listOfData];
              });
            }

            if (message.result == false) {
              Swal.fire({
                position: "center",
                icon: "error",
                title: "Error.",
                showConfirmButton: false,
                timer: 1500
              });
            }
          });
      }
    });
  }
}