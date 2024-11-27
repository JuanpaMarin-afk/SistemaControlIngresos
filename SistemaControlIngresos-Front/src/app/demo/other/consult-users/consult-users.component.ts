// angular import
import { Component, ViewChild } from '@angular/core';

import { LoginService } from 'src/app/services/login-service/login.service';

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
import { AuthService } from '../../authentication/login/authService';
import { LogService } from 'src/app/services/logs-service/log.service';

interface DataItem {
  id: string,
  email: string;
  status: string;
}
@Component({
  selector: 'app-consult-users',
  standalone: true,
  imports: [SharedModule, NzTableComponent, NzFilterTriggerComponent, NzDropDownModule,
    NzTableModule, NzIconModule, NzButtonModule, NzInputModule, NzSwitchModule
    , FormsModule, NzFormModule, NzDatePickerModule, NzTimePickerModule, NzInputNumberModule,
    NzSelectModule, ReactiveFormsModule],
  templateUrl: './consult-users.html',
  styleUrls: ['./consult-users.component.scss']
})
export default class ConsultUsersComponent {

  //LIST FOR ATTENDANTS -- REMEMBER CALL THE SERVICE ON THE CSTR
  listOfData: any[] = [];
  listOfDisplayData = [...this.listOfData];

  roles = [
    { label: 'Administrador', value: 'Administrador' },
    { label: 'Supervisor', value: 'Supervisor' },
    { label: 'Consultor', value: 'Consultor' }
  ];
  user = ""

  //CONSTRUCTOR
  constructor(private authService: AuthService, private fb: FormBuilder,
    private service: LoginService,
    private logService: LogService) {
    this.clientTypeForm = this.fb.group({
      email: ['', [Validators.required]],
      password: ['', [Validators.required]],
      puesto: ['', [Validators.required, Validators.pattern('^[a-zA-Z\\s]+$')]],
      rol: ['', [Validators.required, Validators.pattern('^[a-zA-Z\\s]+$')]]
    });
    this.service.getAllUsers().subscribe(listOfData => {
      this.listOfData = listOfData;
      this.listOfDisplayData = [...this.listOfData];
    });
    this.user = this.authService.getEmail();
  }

  //FORM
  clientTypeForm: FormGroup;

  onSubmit(): void {
    if (this.clientTypeForm.valid) {

      this.service.insertUserAsync({
        email: this.clientTypeForm.value.email,
        password: this.clientTypeForm.value.password, job: this.clientTypeForm.value.puesto,
        rol: this.clientTypeForm.value.rol, status: ""
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
            description: "Agregar Usuario:" + this.clientTypeForm.value.email,
            user: this.user,
            date: today.toISOString()
          }).subscribe(message => { });
          this.service.getAllUsers().subscribe(listOfData => {
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
  async editClientType(id_user: string): Promise<void> {
    const item = this.listOfData.find(item => item.id_user === id_user);

    const rolOptions = this.roles.map(sector =>
      `<option value="${sector.value}" ${sector.value === item.rol ? 'selected' : ''}>${sector.label}</option>`
    ).join('');

    Swal.fire({
      title: 'Modificar Datos',
      html:
        `<input id="swal-input1" class="swal2-input" value="${item.email}" placeholder="Email">` +
        `<input id="swal-input2" type="password" class="swal2-input" value="${item.password}" placeholder="Contraseña">` +
        `<input id="swal-input3" class="swal2-input" value="${item.job}" placeholder="Contraseña">` +
        `<select id="swal-input4" class="swal2-input">${rolOptions}</select>`,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: 'ACEPTAR',
      cancelButtonText: 'CANCELAR',
      preConfirm: () => {
        return {
          email: (document.getElementById('swal-input1') as HTMLInputElement).value,
          password: (document.getElementById('swal-input2') as HTMLInputElement).value,
          job: (document.getElementById('swal-input3') as HTMLInputElement).value,
          roles: (document.getElementById('swal-input4') as HTMLInputElement).value,
        };
      }
    }).then((result) => {
      if (result.isConfirmed) {
        this.service.updateUserAsync({
          id_user: item.id_user, email: result.value.email, password: result.value.password,
          job: result.value.job, rol: result.value.roles, status: item.status
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
                description: "Modificar Usuario:" + result.value.email,
                user: this.user,
                date: today.toISOString()
              }).subscribe(message => { });
              this.service.getAllUsers().subscribe(listOfData => {
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
    this.listOfDisplayData = this.listOfData.filter((item: DataItem) => item.email.indexOf(this.searchValue) !== -1);
  }

  //TOGGLE ATTENDANT STATUS
  toggleAttendantStatusButton(id: string, status: string, name: string): void {

    if (status == "Active") {
      Swal.fire({
        title: "¿Desea deshabilitar este Usuario?",
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
            title: "Usuario deshabilitado",
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
        title: "¿Desea habilitar este Usuario?",
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
            title: "Usuario Habilitado",
            showConfirmButton: false,
            timer: 1500
          });
          //Change Toggle Attendant Status
          this.toggleClientTypeStatus(id, name, "Habilitar");
        }
      });
    }
    this.service.getAllUsers().subscribe(listOfData => {
      this.listOfData = listOfData;
      this.listOfDisplayData = [...this.listOfData];
    });
  }

  // Connection to Service API
  toggleClientTypeStatus(id: string, name: string, type): void {
    this.service.toggleUserStatusAsync({
      id_user: id, name: "", status: "",
      email: "", job: "", rol: "", password: ""
    }).subscribe(
      message => {
        if (message.result == true) {
          const today: Date = new Date();
          this.logService.insertLogsAsync({
            description: type + " Usuario:" + name,
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
        this.service.getAllUsers().subscribe(listOfData => {
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
