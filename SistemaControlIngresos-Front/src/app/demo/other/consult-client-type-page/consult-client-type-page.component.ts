// angular import
import { Component, ViewChild } from '@angular/core';

import { ClientTypeServiceService } from 'src/app/services/client-type-service/client-type-service.service';
import { AuthService } from '../../authentication/login/authService';


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
import { LogService } from 'src/app/services/logs-service/log.service';

interface DataItem {
  id: string,
  name: string;
  status: string;
}
@Component({
  selector: 'app-consult-client-type-page',
  standalone: true,
  imports: [SharedModule, NzTableComponent, NzFilterTriggerComponent, NzDropDownModule,
    NzTableModule, NzIconModule, NzButtonModule, NzInputModule, NzSwitchModule
    , FormsModule, NzFormModule, NzDatePickerModule, NzTimePickerModule, NzInputNumberModule,
    NzSelectModule, ReactiveFormsModule],
  templateUrl: './consult-client-type-page.html',
  styleUrls: ['./consult-client-type-page.component.scss']
})
export default class ConsultClientTypeComponent {

  //LIST FOR ATTENDANTS -- REMEMBER CALL THE SERVICE ON THE CSTR
  listOfData: any[] = [];
  listOfDisplayData = [...this.listOfData];

  rol = ""
  user = ""

  //CONSTRUCTOR
  constructor(private fb: FormBuilder,
    private service: ClientTypeServiceService,
    private authService: AuthService,
    private logService: LogService) {
    this.clientTypeForm = this.fb.group({
      name: ['', [Validators.required, Validators.pattern('^[a-zA-Z\\s]+$')]]
    });
    this.service.getAllTypeClient().subscribe(listOfData => {
      this.listOfData = listOfData;
      this.listOfDisplayData = [...this.listOfData];
    });
    this.rol = this.authService.getRole()
    this.user = this.authService.getEmail();
  }

  //FORM
  clientTypeForm: FormGroup;

  onSubmit(): void {
    if (this.clientTypeForm.valid) {

      this.service.insertTypeClientAsync({ name: this.clientTypeForm.value.name, status: "" }).subscribe(message => {
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
            description: "Agregar Tipo Cliente:" + this.clientTypeForm.value.name,
            user: this.user,
            date: today.toISOString()
          }).subscribe(message => { });
          this.service.getAllTypeClient().subscribe(listOfData => {
            this.listOfData = listOfData;
            this.listOfDisplayData = [...this.listOfData];
          });
          this.clientTypeForm.reset();
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

    } else {
      Swal.fire({
        position: "center",
        icon: "error",
        title: "Por favor, complete el campo de nombre correctamente.",
        showConfirmButton: false,
        timer: 1500
      });
    }
  }

  onClear(): void {
    this.clientTypeForm.reset();
  }

  //EDIT NAME
  async editClientType(id_type: string): Promise<void> {
    const item = this.listOfData.find(item => item.id_type === id_type);

    Swal.fire({
      title: 'Modificar Datos',
      html:
        `<input id="swal-input2" class="swal2-input" value="${item.name}" placeholder="Nombre">`,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: 'ACEPTAR',
      cancelButtonText: 'CANCELAR',
      preConfirm: () => {
        return {
          name: (document.getElementById('swal-input2') as HTMLInputElement).value,
        };
      }
    }).then((result) => {
      if (result.isConfirmed) {
        this.service.updateTypeClientAsync({ id_type: item.id_type, name: result.value.name, status: item.status }).subscribe(
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
                description: "Modificar Tipo Cliente:" + result.value.name,
                user: this.user,
                date: today.toISOString()
              }).subscribe(message => { });
              this.service.getAllTypeClient().subscribe(listOfData => {
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
    this.listOfDisplayData = this.listOfData.filter((item: DataItem) => item.name.indexOf(this.searchValue) !== -1);
  }

  //TOGGLE ATTENDANT STATUS
  toggleAttendantStatusButton(id: string, status: string, name: string): void {

    if (status == "Active") {
      Swal.fire({
        title: "¿Desea deshabilitar este Tipo de Cliente?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "ACEPTAR",
        cancelButtonText: "CANCELAR"
      }).then((result) => {
        if (result.isConfirmed) {
          Swal.fire({
            position: "center",
            icon: "success",
            title: "Tipo de Cliente deshabilitado",
            showConfirmButton: false,
            timer: 1500
          });
          //Change Toggle Attendant Status
          this.toggleClientTypeStatus(id, name, "Deshabilitar");
        }
      });
    }
    if (status == "Disabled") {
      Swal.fire({
        title: "¿Desea habilitar este Tipo de Cliente?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "ACEPTAR",
        cancelButtonText: "CANCELAR"
      }).then((result) => {
        if (result.isConfirmed) {
          Swal.fire({
            position: "center",
            icon: "success",
            title: "Tipo de Cliente Habilitado",
            showConfirmButton: false,
            timer: 1500
          });
          //Change Toggle Attendant Status
          this.toggleClientTypeStatus(id, name, "Habilitar");
        }
      });
    }
    this.service.getAllTypeClient().subscribe(listOfData => {
      this.listOfData = listOfData;
      this.listOfDisplayData = [...this.listOfData];
    });
  }

  // Connection to Service API
  toggleClientTypeStatus(id: string, name: string, type): void {
    this.service.toggleTypeClientStatusAsync({ id_type: id, name: "", status: "" }).subscribe(
      message => {
        if (message.result == true) {
          const today: Date = new Date();
          this.logService.insertLogsAsync({
            description: type + " Tipo Cliente:" + name,
            user: this.user,
            date: today.toISOString()
          }).subscribe(message => { });
        }
        if (message.result == false) {
          Swal.fire({
            position: "center",
            icon: "error",
            title: "Ha ocurrido un error.",
            showConfirmButton: false,
            timer: 1500
          });
        }
        this.service.getAllTypeClient().subscribe(listOfData => {
          this.listOfData = listOfData;
          this.listOfDisplayData = [...this.listOfData];
        });
      });
  }

  beforeConfirm(): Promise<boolean> {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(true);
      }, 3000);
    });
  }

}
