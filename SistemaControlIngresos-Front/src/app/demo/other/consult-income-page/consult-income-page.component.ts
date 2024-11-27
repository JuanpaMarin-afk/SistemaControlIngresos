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
import { IcomeService } from 'src/app/services/income-service/icome.service';


import * as XLSX from 'xlsx'

import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';

(pdfMake as any).vfs = pdfFonts.pdfMake.vfs;

import { headerImageBase64, footerImageBase64 } from './images';
import { ReportsService } from 'src/app/services/reports-service/reports.service';

interface DataItem {
  incomeid: number,
  name: string;
  sector: string;
  legal_id: string;
  id_type: string;
  name_type: string;
  status: string;
}
@Component({
  selector: 'app-consult-income-page',
  standalone: true,
  imports: [SharedModule, NzTableComponent, NzFilterTriggerComponent, NzDropDownModule,
    NzTableModule, NzIconModule, NzButtonModule, NzInputModule, NzSwitchModule
    , FormsModule, NzFormModule, NzDatePickerModule, NzTimePickerModule, NzInputNumberModule,
    NzSelectModule, ReactiveFormsModule],
  templateUrl: './consult-income-page.html',
  styleUrls: ['./consult-income-page.component.scss']
})
export default class ConsultIncomeComponent {

  //LIST FOR ATTENDANTS -- REMEMBER CALL THE SERVICE ON THE CSTR
  listOfData: any[] = [];
  listOfDisplayData = [...this.listOfData];

  projectList: any[] = [];
  rol = ""
  user = ""

  status = [
    { label: '-', value: 'No Pagado' },
    { label: 'Pagado', value: 'Pagado' },
  ];

  formatearMes(mes: string): string {
    const meses = [
      'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
      'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
    ];
    return meses[+mes - 1];
  }

  formatearFecha(fecha: string): string {
    const [anio, mes, dia] = fecha.split('-');
    return `${this.formatearMes(mes)} de ${anio}`;
  }

  constructor(private fb: FormBuilder,
    private authService: AuthService,
    private serviceProject: ProjectService,
    private serviceIncome: IcomeService,
    private serviceEarnings: EarningService,
    private serviceReport: ReportsService,
    private logService: LogService) {

    this.serviceIncome.getAllIncomeDistribution().subscribe(listOfData => {
      this.listOfData = listOfData;
      this.listOfDisplayData = [...this.listOfData];
    });
    this.projectForm = this.fb.group({
      projectId: ['', [Validators.required]],
      estimatedamount: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
      estimatedamountperhour: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
      datemonth: ['', [Validators.required]],
      remarks: ['', [Validators.required]],
    });
    this.reportIncome = this.fb.group({
      dateBegin: ['', [Validators.required]],
      dateEnd: ['', [Validators.required]],
    });
    this.rol = this.authService.getRole();
    this.user = this.authService.getEmail();
    this.serviceProject.getAllProject().subscribe(projectList => {
      this.projectList = projectList;
    });
    this.report2 = this.fb.group({
      projectId: ['', [Validators.required]],
      dateBegin: ['', [Validators.required]],
      dateEnd: ['', [Validators.required]],
    });
  }

  //FORM
  projectForm: FormGroup;
  reportIncome: FormGroup;
  report2: FormGroup;

  onSubmit(): void {
    if (this.projectForm.valid) {
      this.serviceIncome.insertIncomeDistributionAsync({
        estimatedamount: this.projectForm.value.estimatedamount,
        estimatedamountperhour: this.projectForm.value.estimatedamountperhour,
        datemonth: new Date(this.projectForm.value.datemonth).toISOString(),
        remarks: this.projectForm.value.remarks,
        projectid: this.projectForm.value.projectId,
        status: "-",
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
            description: "***Transacción de Distribución de Ingresos:" + this.projectForm.value.estimatedamount + '/'
              + this.projectForm.value.estimatedamountperhour + '/' + this.projectForm.value.projectId + '/' +
              this.projectForm.value.datemonth,
            user: this.user,
            date: today.toISOString()
          }).subscribe(message => { });
          this.serviceIncome.getAllIncomeDistribution().subscribe(listOfData => {
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

  listOfData2: any[] = [];
  listOfDisplayData2 = [...this.listOfData2];

  onConsult(): void {
    this.serviceReport.getAllIncomeDistributionReport(new Date(this.reportIncome.value.dateBegin).toISOString(), new Date(this.reportIncome.value.dateEnd).toISOString()).subscribe(listOfData2 => {
      this.listOfData2 = listOfData2;
      this.listOfDisplayData2 = [...this.listOfData2];
      this.listOfData = listOfData2;
      this.listOfDisplayData = [...this.listOfData];
    });
  }

  onConsult2(): void {
    const projectId = this.report2.value.projectId;
    this.serviceReport.getAllIncomeDistributionReport(new Date(this.report2.value.dateBegin).toISOString(), new Date(this.report2.value.dateEnd).toISOString()).subscribe(listOfData3 => {
      this.listOfData3 = listOfData3;

      // Aplicamos el filtro solo si projectId está definido y no es nulo
      if (projectId) {
        this.listOfDisplayData3 = listOfData3.filter(item => item.projectid === projectId);
      } else {
        // Si no hay projectId específico, mostramos todos los datos
        this.listOfDisplayData3 = [...listOfData3];
      }

      // Repetimos el proceso para listOfData si se requiere manejar de la misma forma
      this.listOfData3 = listOfData3;
      if (projectId) {
        this.listOfDisplayData3 = listOfData3.filter(item => item.projectid === projectId);
      } else {
        this.listOfDisplayData3 = [...listOfData3];
      }
    });
  }

  onClear(): void {
    this.projectForm.reset();
  }

  onClear2(): void {
    this.reportIncome.reset();
    this.listOfData2 = [];
    this.listOfData = [];
    this.serviceIncome.getAllIncomeDistribution().subscribe(listOfData => {
      this.listOfData = listOfData;
      this.listOfDisplayData = [...this.listOfData];
    });
  }
  //LIST FOR ATTENDANTS -- REMEMBER CALL THE SERVICE ON THE CSTR
  listOfData3: any[] = [];
  listOfDisplayData3 = [...this.listOfData];
  onClear3(): void {
    this.report2.reset();
    this.listOfData3 = [];
    this.listOfDisplayData3 = [];
  }

  //EDIT NAME
  async editClient(incomeid: string): Promise<void> {
    const item = this.listOfData.find(item => item.incomeid === incomeid);

    const projectOptions = this.projectList.map(option =>
      `<option value="${option.id_project}" ${option.id_project === item.id_transaction ? 'selected' : ''}>${option.id_project
      + ' - ' + option.client_name + ' - ' + option.project_year + ' - ' + option.type_mount}</option>`
    ).join('');

    const statusOptions = this.status.map(status =>
      `<option value="${status.value}" ${status.label === item?.status ? 'selected' : ''}>${status.label}</option>`
    ).join('');



    const formatDate = (dateString) => {
      if (!dateString) return ''; // Si no hay fecha, retorna una cadena vacía
      const date = new Date(dateString);
      const year = date.getFullYear();
      const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Mes en formato 2 dígitos
      return `${year}-${month}`; // Formato "YYYY-MM"
    };

    const dateEarningFormatted = formatDate(item.datemonth);

    Swal.fire({
      title: 'Modificar Datos',
      html:
        `<select id="swal-input1" class="swal2-input">${projectOptions}</select>` +
        `<input id="swal-input2" class="swal2-input" value="${item.estimatedamount}">` +
        `<input id="swal-input3" class="swal2-input" value="${item.estimatedamountperhour}">` +
        `<input type="month" id="swal-input4" class="swal2-input" value="${dateEarningFormatted}">` +
        `<input id="swal-input5" class="swal2-input" value="${item.remarks}">` +
        `<select id="swal-input6" class="swal2-input">${statusOptions}</select>`,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: 'ACEPTAR',
      cancelButtonText: 'CANCELAR',
      preConfirm: () => {
        return {
          projectid: (document.getElementById('swal-input1') as HTMLInputElement).value,
          estimatedamount: (document.getElementById('swal-input2') as HTMLInputElement).value,
          estimatedamountperhour: (document.getElementById('swal-input3') as HTMLInputElement).value,
          datemonth: (document.getElementById('swal-input4') as HTMLInputElement).value,
          remarks: (document.getElementById('swal-input5') as HTMLInputElement).value,
          status: (document.getElementById('swal-input6') as HTMLInputElement).value,
        };
      }
    }).then((result) => {
      if (result.isConfirmed) {

        this.serviceIncome.updateIncomeDistributionAsync({
          incomeid: item.incomeid,
          estimatedamount: result.value.estimatedamount,
          estimatedamountperhour: result.value.estimatedamountperhour,
          datemonth: new Date(result.value.datemonth).toISOString(),
          remarks: result.value.remarks,
          projectid: result.value.projectid,
          status: result.value.status,
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
                description: "***Modificación Transacción de Distribución de Ingreso:" + result.value.estimatedamount + '/'
                  + result.value.estimatedamountperhour + '/' + result.value.projectId + '/' +
                  result.value.datemonth,
                user: this.user,
                date: today.toISOString()
              }).subscribe(message => { });
              this.serviceIncome.getAllIncomeDistribution().subscribe(listOfData => {
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
      item.incomeid.toString().indexOf(this.searchValue.toString()) !== -1
    );
  }

  async deleteEarning(incomeid: string): Promise<void> {
    const item = this.listOfData.find(item => item.incomeid === incomeid);

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

        this.serviceIncome.deleteIncomeDistributionAsync(item.incomeid).subscribe(
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

              const dateEarningFormatted = formatDate(item.datemonth);

              const today: Date = new Date();
              this.logService.insertLogsAsync({
                description: "***Eliminación Transacción de Distribución de Ingreso:" + item.estimatedamount + '/'
                  + item.estimatedamountperhour + '/' + item.remarks + '/' +
                  dateEarningFormatted,
                user: this.user,
                date: today.toISOString()
              }).subscribe(message => { });
              this.serviceIncome.getAllIncomeDistribution().subscribe(listOfData => {
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

  exportOption(type: number, format: string): void {
    switch (type) {
      case 1:
        switch (format) {
          case 'PDF':
            this.pdf1();
            break;
          case 'Excel':
            const XLSX = require('xlsx');
            const workbook = XLSX.utils.book_new();
            const worksheet = XLSX.utils.json_to_sheet(this.listOfData2);
            XLSX.utils.book_append_sheet(workbook, worksheet, 'DistribuciónDeIngresos');
            XLSX.writeFile(workbook, 'Reporte_Distribucion_Ingresos.xlsx');
            const today: Date = new Date();
            this.logService.insertLogsAsync({
              description: "Generación Reporte Excel Reporte_Distribucion_Ingresos:",
              user: this.user,
              date: today.toISOString()
            }).subscribe(message => { });
        }
        break;
      case 2:
        switch (format) {
          case 'PDF':
            this.pdf2();
            break;
          case 'Excel':
            const XLSX = require('xlsx');
            const workbook = XLSX.utils.book_new();
            const worksheet = XLSX.utils.json_to_sheet(this.listOfDisplayData3);
            XLSX.utils.book_append_sheet(workbook, worksheet, 'DistribuciónDeIngresos');
            XLSX.writeFile(workbook, 'Reporte_Distribucion_Ingresos.xlsx');
            const today: Date = new Date();
            this.logService.insertLogsAsync({
              description: "Generación Reporte Excel Reporte_Distribucion_Ingresos:",
              user: this.user,
              date: today.toISOString()
            }).subscribe(message => { });
        }
        break;
    }
  }

  pdf1(): void {
    // Función para formatear valores numéricos como moneda en CRC
    const formatNumber = (value: number): string => {
      if (value !== null && value !== undefined) {
        return new Intl.NumberFormat('es-CR', {
          style: 'decimal',
          minimumFractionDigits: 0,
          maximumFractionDigits: 0
        })
          .format(value)
          .replace(/\s/g, '.'); // Reemplazar espacios con puntos para separar los miles
      } else {
        return 'No disponible';
      }
    };

    // Función para encontrar y formatear la información del proyecto
    const getProjectDetails = (projectId) => {
      const project = this.projectList.find(option => option.id_project === projectId);
      if (project) {
        return `${project.id_project} - ${project.client_name} - ${project.project_year} - ${project.type_mount}`;
      } else {
        return '-';
      }
    };

    // Calcular sumatorias
    const estimatedAmountSum = this.listOfData2.reduce((sum, item) => sum + (item.estimatedamount ?? 0), 0);
    const estimatedAmountPerHourSum = this.listOfData2.reduce((sum, item) => sum + (item.estimatedamountperhour ?? 0), 0);

    // Crear el contenido de la tabla con el formato de moneda
    const tableBody = [
      // Definir encabezados de la tabla (7 columnas)
      [
        'Nombre del Proyecto',
        'Monto Estimado',
        'Horas',
        'Fecha',
        'Observaciones',
        'Estado',
      ],
      // Agregar cada fila a la tabla con el formato condicional
      ...this.listOfData2.map(item => [
        getProjectDetails(item.projectid),
        formatNumber(item.estimatedamount ?? 0),
        formatNumber(item.estimatedamountperhour ?? 0),
        this.formatearFecha(item.datemonth) ?? '-',
        item.remarks ?? '-',
        item.status ?? '-',
      ]),
      // Agregar fila de sumatorias
      ['Total', formatNumber(estimatedAmountSum), formatNumber(estimatedAmountPerHourSum), '', '', '']
    ];

    // Ajustar los anchos de las columnas (7 columnas)
    const widths = Array(6).fill('auto');

    const text = 'Reporte de Distribucion de Ingresos ' + ' [' + this.reportIncome.value.dateBegin + ' - ' + this.reportIncome.value.dateEnd + ']';

    const docDefinition = {
      pageOrientation: 'landscape', // Configurar la hoja en orientación horizontal
      content: [
        {
          text: text,
          style: 'header',
          alignment: 'center', // Centrar el título principal del contenido
          margin: [0, 50, 0, 10] // Añadir un margen superior grande para empujar hacia abajo
        },
        {
          style: 'tableExample',
          table: {
            widths: widths, // Configurar la tabla para que cada columna tenga un ancho específico
            body: tableBody
          },
          alignment: 'center', // Centrar la tabla en la página
          margin: [0, 10, 0, 10] // Añadir margen para que la tabla no esté pegada al borde
        }
      ],
      styles: {
        header: {
          fontSize: 18,
          bold: true
        },
        subheader: {
          fontSize: 14,
          margin: [0, 10, 0, 10]
        },
        tableExample: {
          margin: [0, 5, 0, 15] // Añadir márgenes alrededor de la tabla
        }
      },
      // Encabezado
      header: {
        image: headerImageBase64, // Agregar la imagen del encabezado
        width: 300,
        alignment: 'center', // Centrar el encabezado
        margin: [0, 10, 0, 10] // Añadir márgenes para espaciarlo del contenido principal
      },
      // Pie de página
      footer: (currentPage, pageCount) => {
        return {
          columns: [
            {
              image: footerImageBase64, // Agregar la imagen del pie de página
              width: 300,
              alignment: 'center', // Centrar el pie de página
              margin: [0, -25, -100, 10] // Añadir margen para espaciado
            },
            {
              text: `Página ${currentPage} de ${pageCount}`, // Añadir numeración de páginas
              alignment: 'right',
              margin: [0, 0, 40, 10] // Añadir margen derecho
            }
          ]
        };
      }
    };

    // Crear y descargar el PDF
    pdfMake.createPdf(docDefinition).download('Reporte_Distribucion_Ingresos.pdf');
    const today: Date = new Date();
    this.logService.insertLogsAsync({
      description: "Generación Reporte PDF Reporte_Distribucion_Ingresos:",
      user: this.user,
      date: today.toISOString()
    }).subscribe(message => { });
  }


  pdf2(): void {
    // Función para formatear valores numéricos como moneda en CRC
    const formatNumber = (value: number): string => {
      if (value !== null && value !== undefined) {
        return new Intl.NumberFormat('es-CR', {
          style: 'decimal',
          minimumFractionDigits: 0,
          maximumFractionDigits: 0
        })
          .format(value)
          .replace(/\s/g, '.'); // Reemplazar espacios con puntos para separar los miles
      } else {
        return 'No disponible';
      }
    };

    // Función para encontrar y formatear la información del proyecto
    const getProjectDetails = (projectId) => {
      const project = this.projectList.find(option => option.id_project === projectId);
      if (project) {
        return `${project.id_project} - ${project.client_name} - ${project.project_year} - ${project.type_mount}`;
      } else {
        return '-';
      }
    };

    // Calcular sumatorias
    const estimatedAmountSum = this.listOfDisplayData3.reduce((sum, item) => sum + (item.estimatedamount ?? 0), 0);
    const estimatedAmountPerHourSum = this.listOfDisplayData3.reduce((sum, item) => sum + (item.estimatedamountperhour ?? 0), 0);

    // Crear el contenido de la tabla con el formato de moneda
    const tableBody = [
      // Definir encabezados de la tabla (7 columnas)
      [
        'Nombre del Proyecto',
        'Monto Estimado',
        'Horas',
        'Fecha',
        'Observaciones',
        'Estado',
      ],
      // Agregar cada fila a la tabla con el formato condicional
      ...this.listOfDisplayData3.map(item => [
        getProjectDetails(item.projectid),
        formatNumber(item.estimatedamount ?? 0),
        formatNumber(item.estimatedamountperhour ?? 0),
        this.formatearFecha(item.datemonth) ?? '-',
        item.remarks ?? '-',
        item.status ?? '-',
      ]),
      // Agregar fila de sumatorias
      ['Total', formatNumber(estimatedAmountSum), formatNumber(estimatedAmountPerHourSum), '', '', '']
    ];

    // Ajustar los anchos de las columnas (7 columnas)
    const widths = Array(6).fill('auto');

    const text = 'Reporte de Distribucion de Ingresos ' + ' [' + this.report2.value.dateBegin + ' - ' + this.report2.value.dateEnd + ']';

    const docDefinition = {
      pageOrientation: 'landscape', // Configurar la hoja en orientación horizontal
      content: [
        {
          text: text,
          style: 'header',
          alignment: 'center', // Centrar el título principal del contenido
          margin: [0, 50, 0, 10] // Añadir un margen superior grande para empujar hacia abajo
        },
        {
          style: 'tableExample',
          table: {
            widths: widths, // Configurar la tabla para que cada columna tenga un ancho específico
            body: tableBody
          },
          alignment: 'center', // Centrar la tabla en la página
          margin: [0, 10, 0, 10] // Añadir margen para que la tabla no esté pegada al borde
        }
      ],
      styles: {
        header: {
          fontSize: 18,
          bold: true
        },
        subheader: {
          fontSize: 14,
          margin: [0, 10, 0, 10]
        },
        tableExample: {
          margin: [0, 5, 0, 15] // Añadir márgenes alrededor de la tabla
        }
      },
      // Encabezado
      header: {
        image: headerImageBase64, // Agregar la imagen del encabezado
        width: 300,
        alignment: 'center', // Centrar el encabezado
        margin: [0, 10, 0, 10] // Añadir márgenes para espaciarlo del contenido principal
      },
      // Pie de página
      footer: (currentPage, pageCount) => {
        return {
          columns: [
            {
              image: footerImageBase64, // Agregar la imagen del pie de página
              width: 300,
              alignment: 'center', // Centrar el pie de página
              margin: [0, -25, -100, 10] // Añadir margen para espaciado
            },
            {
              text: `Página ${currentPage} de ${pageCount}`, // Añadir numeración de páginas
              alignment: 'right',
              margin: [0, 0, 40, 10] // Añadir margen derecho
            }
          ]
        };
      }
    };

    // Crear y descargar el PDF
    pdfMake.createPdf(docDefinition).download('Reporte_Distribucion_Ingresos.pdf');
    const today: Date = new Date();
    this.logService.insertLogsAsync({
      description: "Generación Reporte PDF Reporte_Distribucion_Ingresos:",
      user: this.user,
      date: today.toISOString()
    }).subscribe(message => { });
  }

  nuevoBotonAccion(): void {
    Swal.fire({
      title: "¿Estás seguro?",
      text: "¡No podrás revertir esto!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí",
      cancelButtonText: "Cancelar"
    }).then((result) => {
      if (result.isConfirmed) {

        this.serviceIncome.updateDateForUnpaidIncome({
          incomeid: 0,
          estimatedamount: 0,
          estimatedamountperhour: 0,
          datemonth: "2024-01-01",
          remarks: "",
          projectid: 0,
          status: "",
        }).subscribe(
          message => {
            if (message.result == true) {
              Swal.fire({
                title: "Actualizado!",
                text: "Las Distribuciones se han avanzado un mes.",
                icon: "success"
              });
              this.serviceIncome.getAllIncomeDistribution().subscribe(listOfData => {
                this.listOfData = listOfData;
                this.listOfDisplayData = [...this.listOfData];
              });
              const today: Date = new Date();
              this.logService.insertLogsAsync({
                description: "!!! Aplicacion de Distribucion Meses !!!",
                user: this.user,
                date: today.toISOString()
              }).subscribe(message => { });
            }
            if (message.result == false) {
              Swal.fire({
                position: "center",
                icon: "error",
                title: "No hay distribuciones de ingresos por avanzar.",
                showConfirmButton: false,
                timer: 1500
              });
            }
          });

      }
    });



  }

}