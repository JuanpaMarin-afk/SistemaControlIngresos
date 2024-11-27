// angular import
import { Component } from '@angular/core';

import { ClientServiceService } from 'src/app/services/client-service/client-service.service';
import { ClientTypeServiceService } from 'src/app/services/client-type-service/client-type-service.service';
import { AuthService } from '../../authentication/login/authService';


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
import { LogService } from 'src/app/services/logs-service/log.service';

interface DataItem {
  id: string,
  name: string;
  sector: string;
  legal_id: string;
  id_type: string;
  name_type: string;
  status: string;
}
@Component({
  selector: 'app-consult-client-page',
  standalone: true,
  imports: [SharedModule, NzTableComponent, NzFilterTriggerComponent, NzDropDownModule,
    NzTableModule, NzIconModule, NzButtonModule, NzInputModule, NzSwitchModule
    , FormsModule, NzFormModule, NzDatePickerModule, NzTimePickerModule, NzInputNumberModule,
    NzSelectModule, ReactiveFormsModule],
  templateUrl: './consult-client-page.html',
  styleUrls: ['./consult-client-page.component.scss']
})
export default class ConsultClientComponent {

  //LIST FOR ATTENDANTS -- REMEMBER CALL THE SERVICE ON THE CSTR
  listOfData: any[] = [];
  listOfDisplayData = [...this.listOfData];

  typeClientList: any[] = [];
  rol = ""
  user = ""

  sector = [
    { label: 'Privado', value: 'Privado' },
    { label: 'Público', value: 'Público' }
  ];

  //CONSTRUCTOR
  constructor(private fb: FormBuilder,
    private service: ClientServiceService,
    private serviceType: ClientTypeServiceService,
    private authService: AuthService,
    private logService: LogService) {
    this.clientForm = this.fb.group({
      name: ['', [Validators.required, Validators.pattern('^[a-zA-Z\\s]+$')]],
      legal_id: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
      sector: [null, Validators.required],
      typeClient: [null, Validators.required]
    });
    this.service.getAllClient().subscribe(listOfData => {
      this.listOfData = listOfData;
      this.listOfDisplayData = [...this.listOfData];
    });
    this.serviceType.getAllTypeClient().subscribe(typeClientList => {
      this.typeClientList = typeClientList.filter(typeClient => typeClient.status === 'Active');
    });
    this.rol = this.authService.getRole()
    this.user = this.authService.getEmail();
  }

  //FORM
  clientForm: FormGroup;

  onSubmit(): void {
    if (this.clientForm.valid) {
      this.service.insertClientAsync({
        name: this.clientForm.value.name, sector: this.clientForm.value.sector,
        legal_id: this.clientForm.value.legal_id, id_type: this.clientForm.value.typeClient, name_type: "",
        status: ""
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
            description: "Agregar Cliente:" + this.clientForm.value.name,
            user: this.user,
            date: today.toISOString()
          }).subscribe(message => { });
          this.service.getAllClient().subscribe(listOfData => {
            this.listOfData = listOfData;
            this.listOfDisplayData = [...this.listOfData];
          });
          this.clientForm.reset();
        }
        if (message.result == false) {
          Swal.fire({
            position: "center",
            icon: "error",
            title: "¡Ya existe un registro con este nombre!",
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
    this.clientForm.reset();
  }

  //EDIT NAME
  async editClient(id_client: string): Promise<void> {
    const item = this.listOfData.find(item => item.id_client === id_client);
    const sectorOptions = this.sector.map(sector =>
      `<option value="${sector.value}" ${sector.value === item.sector ? 'selected' : ''}>${sector.label}</option>`
    ).join('');
    const typeClientOptions = this.typeClientList.map(type =>
      `<option value="${type.id_type}" ${type.id_type === item?.id_type ? 'selected' : ''}>${type.name}</option>`
    ).join('');

    Swal.fire({
      title: 'Modificar Datos',
      html:
        `<input id="swal-input2" class="swal2-input" value="${item.name}" placeholder="Nombre">` +
        `<input id="swal-input4" class="swal2-input" value="${item.legal_id}" placeholder="ID Legal">` +
        `<select id="swal-input5" class="swal2-input">${typeClientOptions}</select>` +
        `<select id="swal-input3" class="swal2-input">${sectorOptions}</select>`,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: 'ACEPTAR',
      cancelButtonText: 'CANCELAR',
      preConfirm: () => {
        return {
          name: (document.getElementById('swal-input2') as HTMLInputElement).value,
          legal_id: (document.getElementById('swal-input4') as HTMLInputElement).value,
          id_type: (document.getElementById('swal-input5') as HTMLInputElement).value,
          sector: (document.getElementById('swal-input3') as HTMLInputElement).value,
        };
      }
    }).then((result) => {
      if (result.isConfirmed) {

        this.service.updateClientAsync({
          id_client: item.id_client,
          sector: result.value.sector,
          legal_id: result.value.legal_id,
          id_type: result.value.id_type,
          name_type: "",
          name: result.value.name,
          status: item.status
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
                description: "Modificar Cliente:" + result.value.name,
                user: this.user,
                date: today.toISOString()
              }).subscribe(message => { });
              this.service.getAllClient().subscribe(listOfData => {
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
        title: "¿Desea deshabilitar este Cliente?",
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
            title: "Cliente deshabilitado",
            showConfirmButton: false,
            timer: 1500
          });
          //Change Toggle Attendant Status
          this.toggleClientStatus(id, name, "Deshabilitar");
        }
      });
    }
    if (status == "Disabled") {
      Swal.fire({
        title: "¿Desea habilitar este Cliente?",
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
            title: "Cliente Habilitado",
            showConfirmButton: false,
            timer: 1500
          });
          //Change Toggle Attendant Status
          this.toggleClientStatus(id, name, "Habilitar");
        }
      });
    }
    this.service.getAllClient().subscribe(listOfData => {
      this.listOfData = listOfData;
      this.listOfDisplayData = [...this.listOfData];
    });
  }

  // Connection to Service API
  toggleClientStatus(id: string, name: string, type): void {
    this.service.toggleClientStatusAsync({
      id_client: id, name: "", status: "",
      sector: "", legal_id: "", name_type: "",
    }).subscribe(
      message => {
        if (message.result == true) {
          const today: Date = new Date();
          this.logService.insertLogsAsync({
            description: type + " Cliente:" + name,
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
        this.service.getAllClient().subscribe(listOfData => {
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
