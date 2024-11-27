// angular import
import { Component } from '@angular/core';

import { ClientServiceService } from 'src/app/services/client-service/client-service.service';
import { ClientTypeServiceService } from 'src/app/services/client-type-service/client-type-service.service';
import { AttendantService } from 'src/app/services/attendant-service/attendant.service';

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
import { ProjectService } from 'src/app/services/project-service/project.service';
import { TypeworkService } from 'src/app/services/typework-service/typework.service';
import { LogService } from 'src/app/services/logs-service/log.service';

interface DataItem {
  id_project: number,
  name: string;
  sector: string;
  legal_id: string;
  id_type: string;
  name_type: string;
  status: string;
}
@Component({
  selector: 'app-create-project-page',
  standalone: true,
  imports: [SharedModule, NzTableComponent, NzFilterTriggerComponent, NzDropDownModule,
    NzTableModule, NzIconModule, NzButtonModule, NzInputModule, NzSwitchModule
    , FormsModule, NzFormModule, NzDatePickerModule, NzTimePickerModule, NzInputNumberModule,
    NzSelectModule, ReactiveFormsModule],
  templateUrl: './create-project-page.html',
  styleUrls: ['./create-project-page.component.scss']
})
export default class CreateProjectComponent {

  //LIST FOR ATTENDANTS -- REMEMBER CALL THE SERVICE ON THE CSTR
  listOfData: any[] = [];
  listOfDisplayData = [...this.listOfData];

  clientList: any[] = [];
  attendantList: any[] = [];
  typeworkList: any[] = [];

  type_mount = [
    { label: 'Dólares', value: 'USD' },
    { label: 'Colones', value: 'CRC' }
  ];

  rol = ""
  user = ""

  //CONSTRUCTOR
  constructor(private fb: FormBuilder,
    private service: ClientServiceService,
    private serviceAttendant: AttendantService,
    private authService: AuthService,
    private serviceProject: ProjectService,
    private serviceTypeWork: TypeworkService,
    private logService: LogService) {
    this.projectForm = this.fb.group({
      id_client: ['', Validators.required],
      id_attendant: ['', Validators.required],
      id_type_work: ['', Validators.required],
      contract_mount: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
      type_mount: ['', Validators.required],
      project_year: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
      audit_year: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
      hours: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
      estimation_date: ['', Validators.required],
      date_aprobation: ['', Validators.required],
      begin_Date: ['', Validators.required],
      end_Date: ['', Validators.required],
      official_visit: ['', Validators.required],
      notes: ['', Validators.required],
    });
    this.serviceTypeWork.getAllTypeWork().subscribe(typeworkList => {
      this.typeworkList = typeworkList.filter(typeworkList => typeworkList.status === 'Active');
    });
    this.service.getAllClient().subscribe(clientList => {
      this.clientList = clientList.filter(clientList => clientList.status === 'Active');
    });
    this.serviceAttendant.getAllAttendants().subscribe(attendantList => {
      this.attendantList = attendantList.filter(attendantList => attendantList.status === 'Active');
    });
    this.serviceProject.getAllProject().subscribe(listOfData => {
      this.listOfData = listOfData;
      this.listOfDisplayData = [...this.listOfData];
    });

    this.rol = this.authService.getRole()
    this.user = this.authService.getEmail();
  }

  //FORM
  projectForm: FormGroup;

  onSubmit(): void {
    if (this.projectForm.valid) {
      console.log(this.projectForm.value);
      this.serviceProject.insertProjectAsync({
        id_client: this.projectForm.value.id_client,
        id_attendant: this.projectForm.value.id_attendant,
        id_typework: this.projectForm.value.id_type_work,
        contract_mount: this.projectForm.value.contract_mount,
        type_mount: this.projectForm.value.type_mount,
        project_year: this.projectForm.value.project_year.toString(),
        audit_year: this.projectForm.value.audit_year.toString(),
        hours: this.projectForm.value.hours.toString(),
        payment_estimation: new Date(this.projectForm.value.estimation_date).toISOString(),
        date_begin: new Date(this.projectForm.value.begin_Date).toISOString(),
        date_aprobation: new Date(this.projectForm.value.begin_Date).toISOString(),
        date_end: new Date(this.projectForm.value.end_Date).toISOString(),
        official_visit: this.projectForm.value.official_visit,
        project_number: 0,
        client_name: "string",
        type_work_name: "string",
        attendant_name: "string",
        notes: this.projectForm.value.notes,
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
            description: "Agregar Proyecto:" + this.projectForm.value.contract_mount + '/'
              + this.projectForm.value.type_mount + '/' + this.projectForm.value.project_year + '/' +
              this.projectForm.value.audit_year + '/' + this.projectForm.value.hours + '/'
              + this.projectForm.value.estimation_date + '/' + this.projectForm.value.begin_Date + '/'
              + this.projectForm.value.end_Date + '(' + this.projectForm.value.official_visit + ')',
            user: this.user,
            date: today.toISOString()
          }).subscribe(message => { });
          this.serviceProject.getAllProject().subscribe(listOfData => {
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
        title: "Por favor, complete los campos correctamente.",
        showConfirmButton: false,
        timer: 1500
      });
    }
  }

  onClear(): void {
    this.projectForm.reset();
  }

  //EDIT NAME
  async editClient(id_project: string): Promise<void> {
    const item = this.listOfData.find(item => item.id_project === id_project);

    const clientList = this.clientList.map(client =>
      `<option value="${client.id_client}" ${client.id_client === item?.id_client ? 'selected' : ''}>${client.name}</option>`
    ).join('');

    const attendantOptions = this.attendantList.map(attendant =>
      `<option value="${attendant.id_attendant}" ${attendant.id_attendant === item?.id_attendant ? 'selected' : ''}>${attendant.name}</option>`
    ).join('');

    const typeWorkOptions = this.typeworkList.map(typework =>
      `<option value="${typework.id_type_work}" ${typework.id_type_work === item?.id_typework ? 'selected' : ''}>${typework.name}</option>`
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

    // Formateamos las fechas
    const paymentEstimationFormatted = formatDate(item.payment_estimation);
    const dateBeginFormatted = formatDate(item.date_begin);
    const dateEndFormatted = formatDate(item.date_end);
    const dateAprobationFormatted = formatDate(item.date_aprobation);

    Swal.fire({
      title: 'Modificar Datos',
      html:
        `<select id="swal-input1" class="swal2-input">${clientList}</select>` +
        `<select id="swal-input2" class="swal2-input">${attendantOptions}</select>` +
        `<select id="swal-input3" class="swal2-input">${typeWorkOptions}</select>` +
        `<input id="swal-input4" class="swal2-input" value="${item.contract_mount}">` +
        `<select id="swal-input5" class="swal2-input">${typeOptions}</select>` +
        `<input id="swal-input6" class="swal2-input" value="${item.project_year}">` +
        `<input id="swal-input7" class="swal2-input" value="${item.audit_year}">` +
        `<input id="swal-input8" class="swal2-input" value="${item.hours}">` +
        `<input type="date" id="swal-input13" class="swal2-input" value="${dateAprobationFormatted}">` +
        `<input type="date" id="swal-input9" class="swal2-input" value="${paymentEstimationFormatted}">` +
        `<input type="date" id="swal-input10" class="swal2-input" value="${dateBeginFormatted}">` +
        `<input type="date" id="swal-input11" class="swal2-input" value="${dateEndFormatted}">` +
        `<input id="swal-input12" class="swal2-input" value="${item.official_visit}">` +
        `<input id="swal-input14" class="swal2-input" value="${item.notes ? item.notes : ''}">`,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: 'ACEPTAR',
      cancelButtonText: 'CANCELAR',
      preConfirm: () => {
        return {
          id_client: (document.getElementById('swal-input1') as HTMLInputElement).value,
          id_attendant: (document.getElementById('swal-input2') as HTMLInputElement).value,
          id_typework: (document.getElementById('swal-input3') as HTMLInputElement).value,
          contract_mount: (document.getElementById('swal-input4') as HTMLInputElement).value,
          type_mount: (document.getElementById('swal-input5') as HTMLInputElement).value,
          project_year: (document.getElementById('swal-input6') as HTMLInputElement).value,
          audit_year: (document.getElementById('swal-input7') as HTMLInputElement).value,
          hours: (document.getElementById('swal-input8') as HTMLInputElement).value,
          payment_estimation: (document.getElementById('swal-input9') as HTMLInputElement).value,
          date_aprobation: (document.getElementById('swal-input13') as HTMLInputElement).value,
          date_begin: (document.getElementById('swal-input10') as HTMLInputElement).value,
          date_end: (document.getElementById('swal-input11') as HTMLInputElement).value,
          official_visit: (document.getElementById('swal-input12') as HTMLInputElement).value,
          notes: (document.getElementById('swal-input14') as HTMLInputElement).value,
        };
      }
    }).then((result) => {
      if (result.isConfirmed) {
        this.serviceProject.updateProjectAsync({
          id_project: item.id_project,
          id_client: result.value.id_client,
          id_attendant: result.value.id_attendant,
          id_typework: result.value.id_typework,
          contract_mount: result.value.contract_mount,
          type_mount: result.value.type_mount,
          project_year: result.value.project_year.toString(),
          audit_year: result.value.audit_year.toString(),
          hours: result.value.hours.toString(),
          payment_estimation: new Date(result.value.payment_estimation).toISOString(),
          date_aprobation: new Date(result.value.date_aprobation).toISOString(),
          date_begin: new Date(result.value.date_begin).toISOString(),
          date_end: new Date(result.value.date_end).toISOString(),
          official_visit: result.value.official_visit,
          project_number: 0,
          client_name: "string",
          type_work_name: "string",
          attendant_name: "string",
          notes: result.value.notes,
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
                description: "Modificar Proyecto:" + result.value.contract_mount + '/'
                  + result.value.type_mount + '/' + result.value.project_year + '/' +
                  result.value.audit_year + '/' + result.value.hours + '/'
                  + result.value.payment_estimation + '/' + result.value.date_begin + '/'
                  + result.value.date_end + '(' + result.value.official_visit + ')',
                user: this.user,
                date: today.toISOString()
              }).subscribe(message => { });
              this.serviceProject.getAllProject().subscribe(listOfData => {
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
      item.id_project.toString().indexOf(this.searchValue.toString()) !== -1
    );
  }

  beforeConfirm(): Promise<boolean> {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(true);
      }, 3000);
    });
  }

}
