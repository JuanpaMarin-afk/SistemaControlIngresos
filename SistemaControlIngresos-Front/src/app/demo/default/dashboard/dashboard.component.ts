// angular import
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

// project import
import tableData from 'src/fake-data/default-data.json';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { MonthlyBarChartComponent } from './monthly-bar-chart/monthly-bar-chart.component';
import { IncomeOverviewChartComponent } from './income-overview-chart/income-overview-chart.component';
import { AnalyticsChartComponent } from './analytics-chart/analytics-chart.component';
import { SalesReportChartComponent } from './sales-report-chart/sales-report-chart.component';

// icons
import { IconService } from '@ant-design/icons-angular';
import { FallOutline, GiftOutline, MessageOutline, RiseOutline, SettingOutline } from '@ant-design/icons-angular/icons';
import { ReportsService } from 'src/app/services/reports-service/reports.service';


import { NzTableModule } from 'ng-zorro-antd/table';
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

// project import
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ClientServiceService } from 'src/app/services/client-service/client-service.service';
import { TypeworkService } from 'src/app/services/typework-service/typework.service';

import * as XLSX from 'xlsx'

import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';

(pdfMake as any).vfs = pdfFonts.pdfMake.vfs;

import { headerImageBase64, footerImageBase64 } from './images';
import { LogService } from 'src/app/services/logs-service/log.service';
import { AuthService } from '../../authentication/login/authService';


@Component({
  selector: 'app-default',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,

    // Módulos Ng-Zorro que estás utilizando en tu componente
    NzTableModule,
    NzDropDownModule,
    NzIconModule,
    NzButtonModule,
    NzInputModule,
    NzSwitchModule,
    NzFormModule,
    NzDatePickerModule,
    NzTimePickerModule,
    NzInputNumberModule,
    NzSelectModule,

    // Importar componentes propios
    SharedModule,
    MonthlyBarChartComponent,
    IncomeOverviewChartComponent,
    AnalyticsChartComponent,
    SalesReportChartComponent
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DefaultComponent {
  // Variables para almacenar los resultados
  earningsInColones: any[];
  valorFormateado: string;
  earningsInDollars: any[];
  valorFormateado2: string;
  consolidatedEarningsInColones: any[];
  valorFormateado3: string;
  totalEarningsMinusAmount: any[];
  valorFormateado4: string;

  months = [
    { label: 'Enero', value: '1' },
    { label: 'Febrero', value: '2' },
    { label: 'Marzo', value: '3' },
    { label: 'Abril', value: '4' },
    { label: 'Mayo', value: '5' },
    { label: 'Junio', value: '6' },
    { label: 'Julio', value: '7' },
    { label: 'Agosto', value: '8' },
    { label: 'Septiembre', value: '9' },
    { label: 'Octubre', value: '10' },
    { label: 'Noviembre', value: '11' },
    { label: 'Diciembre', value: '12' }
  ];
  payment = [
    { label: 'Facturado', value: true },
    { label: 'No Facturado', value: false }
  ];
  sector = [
    { label: 'Privado', value: 'Privado' },
    { label: 'Público', value: 'Público' }
  ];

  typeworkList: any[] = [];
  clientList: any[] = [];

  user = ""
  // constructor
  constructor(
    private fb: FormBuilder,
    private iconService: IconService,
    private serviceReport: ReportsService,
    private serviceClient: ClientServiceService,
    private serviceTypeWork: TypeworkService, private logService: LogService, private authService: AuthService
  ) {
    this.iconService.addIcon(...[RiseOutline, FallOutline, SettingOutline, GiftOutline, MessageOutline]);
    this.reportMonth = this.fb.group({
      dateBegin: ['', Validators.required],
      dateEnd: ['', Validators.required],
    });
    this.reportPay = this.fb.group({
      status: ['', Validators.required],
      year: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
    });
    this.report3 = this.fb.group({
      typeWork: ['', Validators.required],
      client: ['', Validators.required],
      dateBegin: ['', Validators.required],
      dateEnd: ['', Validators.required],
    });
    this.serviceTypeWork.getAllTypeWork().subscribe(typeworkList => {
      this.typeworkList = typeworkList;
    });
    this.serviceClient.getAllClient().subscribe(clientList => {
      this.clientList = clientList;
    });
    this.reportColones = this.fb.group({
      dateBegin: ['', Validators.required],
      dateEnd: ['', Validators.required],
    });
    this.reportDolares = this.fb.group({
      dateBegin: ['', Validators.required],
      dateEnd: ['', Validators.required],
    });
    this.reportConsolidado = this.fb.group({
      dateBegin: ['', Validators.required],
      dateEnd: ['', Validators.required],
    });
    this.reportControl = this.fb.group({
      dateBegin: ['', Validators.required],
      dateEnd: ['', Validators.required],
      year: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
      clientId: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
    });
    this.reportControlClients = this.fb.group({
      dateBegin: ['', Validators.required],
      dateEnd: ['', Validators.required],
      year: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
    });
    this.reportSector = this.fb.group({
      sector: ['', Validators.required],
      dateBegin: ['', Validators.required],
      dateEnd: ['', Validators.required],
    });
    this.user = this.authService.getEmail();

  }
  currentYear: number;
  // CONSULTAR DE INGRESOS Y CONTROL

  reportColones: FormGroup;
  reportDolares: FormGroup;
  reportConsolidado: FormGroup;
  reportControl: FormGroup;
  reportControlClients: FormGroup;
  reportSector: FormGroup;


  listOfDataColones: any[] = [];
  listOfDataDolares: any[] = [];
  listOfDataConsolidado: any[] = [];
  listOfDataControl: any[] = [];
  listOfDataControlClients: any[] = [];

  onClear(): void {
    this.reportMonth.reset();
    this.listOfData = [];
    this.listOfDisplayData = [];
  }

  onClear2(): void {
    this.reportPay.reset();
    this.listOfData2 = [];
    this.listOfDisplayData2 = [];
  }

  onClear3(): void {
    this.report3.reset();
    this.listOfData3 = [];
    this.listOfDisplayData3 = [];
  }

  onClearColones(): void {
    this.reportColones.reset();
    this.listOfDataColones = [];
  }

  onClearDolares(): void {
    this.reportDolares.reset();
    this.listOfDataDolares = [];
  }

  onClearConsolidado(): void {
    this.reportConsolidado.reset();
    this.listOfDataConsolidado = [];
  }

  onClearControl(): void {
    this.reportControl.reset();
    this.listOfDataControl = [];
  }

  onClearControlClients(): void {
    this.reportControlClients.reset();
    this.listOfDataControlClients = [];
  }

  onClearReportSector(): void {
    this.reportSector.reset();
    this.listOfDisplayDataSector = [];
  }

  onSubmitColones(): void {
    this.serviceReport.getEarningsInColones(new Date(this.reportColones.value.dateBegin).toISOString(), new Date(this.reportColones.value.dateEnd).toISOString()).subscribe(listOfDataColones => {
      this.listOfDataColones = listOfDataColones;
    });
  }

  onSubmitDolares(): void {
    this.serviceReport.getEarningsInDollars(new Date(this.reportDolares.value.dateBegin).toISOString(), new Date(this.reportDolares.value.dateEnd).toISOString()).subscribe(listOfDataDolares => {
      this.listOfDataDolares = listOfDataDolares;
    });
  }

  onSubmitConsolidado(): void {
    this.serviceReport.getConsolidatedEarningsInColones(new Date(this.reportConsolidado.value.dateBegin).toISOString(), new Date(this.reportConsolidado.value.dateEnd).toISOString()).subscribe(listOfDataConsolidado => {
      this.listOfDataConsolidado = listOfDataConsolidado;
    });
  }

  onSubmitControl(): void {
    this.serviceReport.getTotalEarningsMinusAmount(this.reportControl.value.year, this.reportControl.value.clientId, new Date(this.reportControl.value.dateBegin).toISOString(), new Date(this.reportControl.value.dateEnd).toISOString()).subscribe(listOfDataControl => {
      this.listOfDataControl = listOfDataControl;
    });
  }

  onSubmitControlClients(): void {
    this.serviceReport.getControlClients(this.reportControlClients.value.year, new Date(this.reportControlClients.value.dateBegin).toISOString(), new Date(this.reportControlClients.value.dateEnd).toISOString()).subscribe(listOfDataControl => {
      this.listOfDataControlClients = listOfDataControl;
    });
  }

  // Métodos para consumir la API y actualizar AnalyticEcommerce

  //FORM
  reportMonth: FormGroup;
  reportPay: FormGroup;
  report3: FormGroup;

  recentOrder = tableData;

  listOfData: any[] = [];
  listOfDisplayData = [...this.listOfData]; // Months

  onSubmit(): void {
    this.serviceReport.getProjectReportByMonth(new Date(this.reportMonth.value.dateBegin).toISOString(), new Date(this.reportMonth.value.dateEnd).toISOString()).subscribe(listOfData => {
      this.listOfData = listOfData;
      this.listOfDisplayData = [...this.listOfData];
    });
  }

  listOfData2: any[] = [];
  listOfDisplayData2 = [...this.listOfData2];

  onSubmit2(): void {
    this.serviceReport.getProjectReportByStatus(this.reportPay.value.status, this.reportPay.value.year).subscribe(listOfData2 => {
      this.listOfData2 = listOfData2;
      this.listOfDisplayData2 = [...this.listOfData2];
    });
  }

  listOfData3: any[] = [];
  listOfDisplayData3 = [...this.listOfData3];

  onSubmit3(): void {
    this.serviceReport.getProjectReportByTypeWorkAndClient(this.report3.value.typeWork, this.report3.value.client, new Date(this.report3.value.dateBegin).toISOString(), new Date(this.report3.value.dateEnd).toISOString()).subscribe(listOfData3 => {
      this.listOfData3 = listOfData3;
      this.listOfDisplayData3 = [...this.listOfData3];
    });
  }

  listOfDataSector: any[] = [];
  listOfDisplayDataSector = [...this.listOfData3];

  onSubmitSector(): void {
    this.serviceReport.getProjectSector(this.reportSector.value.sector, new Date(this.reportSector.value.dateBegin).toISOString(), new Date(this.reportSector.value.dateEnd).toISOString()).subscribe(listOfDataSector => {
      this.listOfDataSector = listOfDataSector;
      this.listOfDisplayDataSector = [...this.listOfDataSector];
    });
  }

  exportOption(type: number, format: string): void {
    switch (type) {
      case 1: // Ingresos en Colones
        switch (format) { // listOfDataColones: any[] = [];
          case 'PDF':
            this.pdf1();
            break;
          case 'Excel':
            const XLSX = require('xlsx');
            const workbook = XLSX.utils.book_new();
            const worksheet = XLSX.utils.json_to_sheet(this.listOfDataColones);
            XLSX.utils.book_append_sheet(workbook, worksheet, 'IngresosColones');
            XLSX.writeFile(workbook, 'Reporte_Ingresos_Colones.xlsx');

            const today: Date = new Date();
            this.logService.insertLogsAsync({
              description: "Generación Reporte Excel Reporte_Ingresos_Colones:",
              user: this.user,
              date: today.toISOString()
            }).subscribe(message => { });
        }
        break;
      case 2: // Ingresos en Dólares
        switch (format) { // listOfDataDolares: any[] = [];
          case 'PDF':
            this.pdf2();
            break;
          case 'Excel':
            const XLSX = require('xlsx');
            const workbook = XLSX.utils.book_new();
            const worksheet = XLSX.utils.json_to_sheet(this.listOfDataDolares);
            XLSX.utils.book_append_sheet(workbook, worksheet, 'IngresosDólares');
            XLSX.writeFile(workbook, 'Reporte_Ingresos_Dólares.xlsx');

            const today: Date = new Date();
            this.logService.insertLogsAsync({
              description: "Generación Reporte Excel Reporte_Ingresos_Dólares:",
              user: this.user,
              date: today.toISOString()
            }).subscribe(message => { });
        }
        break;
      case 3: // Ingresos Consolidado a Colones
        switch (format) { // listOfDataConsolidado: any[] = [];
          case 'PDF':
            this.pdf3();
            break;
          case 'Excel':
            const XLSX = require('xlsx');
            const workbook = XLSX.utils.book_new();
            const worksheet = XLSX.utils.json_to_sheet(this.listOfDataConsolidado);
            XLSX.utils.book_append_sheet(workbook, worksheet, 'ConsolidadoColones');
            XLSX.writeFile(workbook, 'Reporte_Ingresos_Consolidado_Colones.xlsx');
            const today: Date = new Date();
            this.logService.insertLogsAsync({
              description: "Generación Reporte Excel Reporte_Ingresos_Consolidado_Colones:",
              user: this.user,
              date: today.toISOString()
            }).subscribe(message => { });
        }
        break;
      case 4: // Reporte Control
        switch (format) { // listOfDataControl: any[] = [];
          case 'PDF':
            this.pdf4();
            break;
          case 'Excel':
            const XLSX = require('xlsx');
            const workbook = XLSX.utils.book_new();
            const worksheet = XLSX.utils.json_to_sheet(this.listOfDataControl);
            XLSX.utils.book_append_sheet(workbook, worksheet, 'Control');
            XLSX.writeFile(workbook, 'Reporte_Ingresos_Control.xlsx');
            const today: Date = new Date();
            this.logService.insertLogsAsync({
              description: "Generación Reporte Excel Reporte_Ingresos_Control:",
              user: this.user,
              date: today.toISOString()
            }).subscribe(message => { });
        }
        break;
      case 5: // Reporte de Estado de Proyectos Facturados
        switch (format) { // listOfData2: any[] = [];
          case 'PDF':
            this.pdf5();
            break;
          case 'Excel':
            const XLSX = require('xlsx');
            const workbook = XLSX.utils.book_new();

            // Convertir los datos directamente en una hoja de trabajo sin filtrar
            const worksheet = XLSX.utils.json_to_sheet(this.listOfData2, {
              header: [
                "iD_PROJECT",
                "clienT_NAME",
                "typE_WORK_NAME",
                "contracT_MOUNT",
                "totaL_EARNINGS",
                "typE_MOUNT",
                "datE_BEGIN",
                "datE_END",
                "datE_EARNING",
                "datE_APROBATION", // Agregamos de nuevo el campo datE_APROBATION
                "pagado"
              ]
            });

            worksheet['A1'].v = 'IdProyecto';
            worksheet['B1'].v = 'Cliente';
            worksheet['C1'].v = 'Tipo de Trabajo';
            worksheet['D1'].v = 'Monto de Contrato';
            worksheet['E1'].v = 'Monto Total Ingresos';
            worksheet['F1'].v = 'Tipo de Monto';
            worksheet['G1'].v = 'Fecha Inicio';
            worksheet['H1'].v = 'Fecha Fin';
            worksheet['I1'].v = 'Fecha de Pago';
            worksheet['J1'].v = 'Fecha de Aprobación';  // Este título ahora es coherente con los datos
            worksheet['K1'].v = '¿Pagado?';

            XLSX.utils.book_append_sheet(workbook, worksheet, 'Estado de Proyectos Facturados');
            XLSX.writeFile(workbook, 'Reporte_Estado_Proyectos_Facturados.xlsx');
            const today: Date = new Date();
            this.logService.insertLogsAsync({
              description: "Generación Reporte Excel Reporte_Estado_Proyectos_Facturados:",
              user: this.user,
              date: today.toISOString()
            }).subscribe(message => { });
        }
        break;
      case 6: // Reporte de Estado de Proyectos Meses
        switch (format) { // listOfData: any[] = [];
          case 'PDF':
            this.pdf6();
            break;
          case 'Excel':
            const XLSX = require('xlsx');
            const workbook = XLSX.utils.book_new();
            // Convertir los datos filtrados en una hoja de trabajo
            const worksheet = XLSX.utils.json_to_sheet(this.listOfData, {
              header: [
                "iD_PROJECT",
                "clienT_NAME",
                "typE_WORK_NAME",
                "contracT_MOUNT",
                "totaL_EARNINGS",
                "typE_MOUNT",
                "datE_BEGIN",
                "datE_END",
                "datE_EARNING",
                "datE_APROBATION", // Agregamos de nuevo el campo datE_APROBATION
                "pagado"
              ]
            });
            worksheet['A1'].v = 'IdProyecto';
            worksheet['B1'].v = 'Cliente';
            worksheet['C1'].v = 'Tipo de Trabajo';
            worksheet['D1'].v = 'Monto de Contrato';
            worksheet['E1'].v = 'Monto Total Ingresos';
            worksheet['F1'].v = 'Tipo de Monto';
            worksheet['G1'].v = 'Fecha Inicio';
            worksheet['H1'].v = 'Fecha Fin';
            worksheet['J1'].v = 'Fecha de Aprobación';  // Este título ahora es coherente con los datos
            worksheet['K1'].v = '¿Pagado?';
            XLSX.utils.book_append_sheet(workbook, worksheet, 'Estado de Proyectos Facturados');
            XLSX.writeFile(workbook, 'Reporte_Estado_Proyectos_Meses.xlsx');
            const today: Date = new Date();
            this.logService.insertLogsAsync({
              description: "Generación Reporte Excel Reporte_Estado_Proyectos_Meses:",
              user: this.user,
              date: today.toISOString()
            }).subscribe(message => { });
        }
        break;
      case 7: // Reporte de Estado de Proyectos Cliente y Tipo de Trabajo
        switch (format) { // listOfData3: any[] = [];
          case 'PDF':
            this.pdf7();
            break;
          case 'Excel':
            const XLSX = require('xlsx');
            const workbook = XLSX.utils.book_new();
            // Convertir los datos filtrados en una hoja de trabajo
            const worksheet = XLSX.utils.json_to_sheet(this.listOfData3, {
              header: [
                "iD_PROJECT",
                "clienT_NAME",
                "typE_WORK_NAME",
                "contracT_MOUNT",
                "totaL_EARNINGS",
                "typE_MOUNT",
                "datE_BEGIN",
                "datE_END",
                "datE_EARNING",
                "datE_APROBATION", // Agregamos de nuevo el campo datE_APROBATION
                "pagado"
              ]
            });
            worksheet['A1'].v = 'IdProyecto';
            worksheet['B1'].v = 'Cliente';
            worksheet['C1'].v = 'Tipo de Trabajo';
            worksheet['D1'].v = 'Monto de Contrato';
            worksheet['E1'].v = 'Monto Total Ingresos';
            worksheet['F1'].v = 'Tipo de Monto';
            worksheet['G1'].v = 'Fecha Inicio';
            worksheet['H1'].v = 'Fecha Fin';
            worksheet['I1'].v = 'Fecha de Pago';
            worksheet['J1'].v = 'Fecha de Aprobación';  // Este título ahora es coherente con los datos
            worksheet['K1'].v = '¿Pagado?';
            XLSX.utils.book_append_sheet(workbook, worksheet, 'Estado de Proyectos Facturados');
            XLSX.writeFile(workbook, 'Reporte_Estado_Proyectos_Cliente_TipoTrabajo.xlsx');
            const today: Date = new Date();
            this.logService.insertLogsAsync({
              description: "Generación Reporte Excel Reporte_Estado_Proyectos_Cliente_TipoTrabajo:",
              user: this.user,
              date: today.toISOString()
            }).subscribe(message => { });
        }
        break;
      case 8: // Reporte de Estado de Control Clientes
        switch (format) { // listOfDataControlClients: any[] = [];
          case 'PDF':
            this.pdf8();
            break;
          case 'Excel':
            const XLSX = require('xlsx');
            const workbook = XLSX.utils.book_new();
            const worksheet = XLSX.utils.json_to_sheet(this.listOfDataControlClients);
            XLSX.utils.book_append_sheet(workbook, worksheet, 'ControlClientes');
            XLSX.writeFile(workbook, 'Reporte_Control_Clientes.xlsx');
            const today: Date = new Date();
            this.logService.insertLogsAsync({
              description: "Generación Reporte Excel Reporte_Control_Clientes:",
              user: this.user,
              date: today.toISOString()
            }).subscribe(message => { });
        }
        break;
      case 9: // Reporte de Estado de Proyectos Sector
        switch (format) { // listOfDataSector: any[] = [];
          case 'PDF':
            this.pdf9();
            break;
          case 'Excel':
            const XLSX = require('xlsx');
            const workbook = XLSX.utils.book_new();
            // Convertir los datos filtrados en una hoja de trabajo
            const worksheet = XLSX.utils.json_to_sheet(this.listOfDataSector, {
              header: [
                "iD_PROJECT",
                "clienT_NAME",
                "typE_WORK_NAME",
                "contracT_MOUNT",
                "totaL_EARNINGS",
                "typE_MOUNT",
                "datE_BEGIN",
                "datE_END",
                "datE_EARNING",
                "datE_APROBATION", // Agregamos de nuevo el campo datE_APROBATION
                "pagado"
              ]
            });
            worksheet['A1'].v = 'IdProyecto';
            worksheet['B1'].v = 'Cliente';
            worksheet['C1'].v = 'Tipo de Trabajo';
            worksheet['D1'].v = 'Monto de Contrato';
            worksheet['E1'].v = 'Monto Total Ingresos';
            worksheet['F1'].v = 'Tipo de Monto';
            worksheet['G1'].v = 'Fecha Inicio';
            worksheet['H1'].v = 'Fecha Fin';
            worksheet['I1'].v = 'Fecha de Pago';
            worksheet['J1'].v = 'Fecha de Aprobación';  // Este título ahora es coherente con los datos
            worksheet['K1'].v = '¿Pagado?';
            XLSX.utils.book_append_sheet(workbook, worksheet, 'Estado de Proyectos Facturados');
            XLSX.writeFile(workbook, 'Reporte_Estado_Proyectos_Sectores.xlsx');
            const today: Date = new Date();
            this.logService.insertLogsAsync({
              description: "Generación Reporte Excel Reporte_Estado_Proyectos_Sectores:",
              user: this.user,
              date: today.toISOString()
            }).subscribe(message => { });
        }
        break;
    }
  }

  pdf1(): void {
    // Función para formatear valores numéricos como moneda en CRC
    const formatCurrency = (value) => {
      if (value !== null && value !== undefined) {
        return 'CRC ' + new Intl.NumberFormat('es-CR', {
          style: 'decimal',
          minimumFractionDigits: 0,
          maximumFractionDigits: 0
        })
          .format(value)
          .replace(/\s/g, '.'); // Reemplazar espacios con puntos para separar los miles
      } else {
        return 'No se encuentran registrados ingresos en estas fechas';
      }
    };

    // Crear el contenido de la tabla con el formato de moneda
    const tableBody = [
      // Definir encabezados de la tabla
      ['Ingreso Total en Colones'],
      // Agregar cada fila a la tabla con el formato condicional
      ...this.listOfDataColones.map(item => [formatCurrency(item.total_Ingresos_Colones)])
    ];
    // Aplicar la función a las fechas
    const text = 'Reporte de Ingresos en Colones ('
      + this.reportColones.value.dateBegin
      + ' | '
      + this.reportColones.value.dateEnd + ')';
    const docDefinition = {
      pageOrientation: 'landscape', // Configurar la hoja en orientación horizontal
      content: [
        {
          text: text,
          //text: 'Reporte de Ingresos en Colones',
          style: 'header',
          alignment: 'center', // Centrar el título principal del contenido
          margin: [0, 50, 0, 10] // Añadir un margen superior grande para empujar hacia abajo
        },
        {
          style: 'tableExample',
          table: {
            widths: ['*'], // Configurar la tabla para que ocupe todo el ancho disponible
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
        image: headerImageBase64, // Agregar la imagen del pie de página
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
    pdfMake.createPdf(docDefinition).download('Reporte_Ingresos_Colones.pdf');
    const today: Date = new Date();
    this.logService.insertLogsAsync({
      description: "Generación Reporte PDF Reporte_Ingresos_Colones:",
      user: this.user,
      date: today.toISOString()
    }).subscribe(message => { });
  }

  pdf2(): void {
    // Función para formatear valores numéricos como moneda en USD
    const formatCurrencyUSD = (value) => {
      if (value !== null && value !== undefined) {
        return 'USD ' + new Intl.NumberFormat('en-US', {
          style: 'decimal',
          minimumFractionDigits: 0,
          maximumFractionDigits: 0
        })
          .format(value)
          .replace(/\s/g, ','); // Reemplazar espacios con comas para separar los miles en el formato estadounidense
      } else {
        return 'No se encuentran registrados ingresos en estas fechas';
      }
    };

    // Crear el contenido de la tabla con el formato de moneda en dólares
    const tableBodyUSD = [
      // Definir encabezados de la tabla
      ['Ingreso Total en Dólares'],
      // Agregar cada fila a la tabla con el formato condicional
      ...this.listOfDataDolares.map(item => [formatCurrencyUSD(item.total_Ingresos_Dolares)])
    ];
    // Aplicar la función a las fechas
    const text = 'Reporte de Ingresos en Dólares ('
      + this.reportDolares.value.dateBegin
      + ' | '
      + this.reportDolares.value.dateEnd + ')';
    const docDefinitionUSD = {
      pageOrientation: 'landscape', // Configurar la hoja en orientación horizontal
      content: [
        {
          text: text,
          //text: 'Reporte de Ingresos en Dólares',
          style: 'header',
          alignment: 'center', // Centrar el título principal del contenido
          margin: [0, 50, 0, 10] // Añadir un margen superior grande para empujar hacia abajo
        },
        {
          style: 'tableExample',
          table: {
            widths: ['*'], // Configurar la tabla para que ocupe todo el ancho disponible
            body: tableBodyUSD
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
        image: headerImageBase64, // Agregar la imagen del pie de página
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
    pdfMake.createPdf(docDefinitionUSD).download('Reporte_Ingresos_Dolares.pdf');
    const today: Date = new Date();
    this.logService.insertLogsAsync({
      description: "Generación Reporte PDF Reporte_Ingresos_Dolares:",
      user: this.user,
      date: today.toISOString()
    }).subscribe(message => { });
  }

  pdf3(): void {
    // Función para formatear valores numéricos como moneda en CRC
    const formatCurrency = (value) => {
      if (value !== null && value !== undefined) {
        return 'CRC ' + new Intl.NumberFormat('es-CR', {
          style: 'decimal',
          minimumFractionDigits: 0,
          maximumFractionDigits: 0
        })
          .format(value)
          .replace(/\s/g, '.'); // Reemplazar espacios con puntos para separar los miles
      } else {
        return 'No se encuentran registrados ingresos en estas fechas';
      }
    };

    // Crear el contenido de la tabla con el formato de moneda
    const tableBody = [
      // Definir encabezados de la tabla
      ['Ingreso Total Consolidado en Colones'],
      // Agregar cada fila a la tabla con el formato condicional
      ...this.listOfDataConsolidado.map(item => [formatCurrency(item.total_Ingresos_Consolidados_Colones)])
    ];
    // Aplicar la función a las fechas
    const text = 'Reporte de Ingresos Consolidados a Colones ('
      + this.reportConsolidado.value.dateBegin
      + ' | '
      + this.reportConsolidado.value.dateEnd + ')';
    const docDefinition = {
      pageOrientation: 'landscape', // Configurar la hoja en orientación horizontal
      content: [
        {
          text: text,
          //text: 'Reporte de Ingresos Consolidados a Colones',
          style: 'header',
          alignment: 'center', // Centrar el título principal del contenido
          margin: [0, 50, 0, 10] // Añadir un margen superior grande para empujar hacia abajo
        },
        {
          style: 'tableExample',
          table: {
            widths: ['*'], // Configurar la tabla para que ocupe todo el ancho disponible
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
        image: headerImageBase64, // Agregar la imagen del pie de página
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
    pdfMake.createPdf(docDefinition).download('Reporte_Ingresos_Consolidado_Colones.pdf');
    const today: Date = new Date();
    this.logService.insertLogsAsync({
      description: "Generación Reporte PDF Reporte_Ingresos_Consolidado_Colones:",
      user: this.user,
      date: today.toISOString()
    }).subscribe(message => { });
  }

  pdf4(): void {
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
        return 'No se encuentran registrados ingresos en estas fechas';
      }
    };

    // Crear el contenido de la tabla con el formato de moneda
    const tableBody = [
      // Definir encabezados de la tabla 
      ['Ingreso Total', 'Monto Faltante'],
      // Agregar cada fila a la tabla con el formato condicional
      ...this.listOfDataControl.map(item => [
        formatNumber(item.total_Ingresos),
        formatNumber(item.monto_Faltante)
      ])
    ];

    const client = this.clientList.find(item => item.id_client === this.reportControl.value.clientId);

    // Aplicar la función a las fechas
    const text = 'Reporte de Control ' + this.reportControl.value.year + ' - ' + client?.name + ' - ('
      + this.reportControl.value.dateBegin
      + ' | '
      + this.reportControl.value.dateEnd + ')';
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
            widths: ['*', '*'], // Configurar la tabla para que cada columna ocupe un ancho proporcional
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
    pdfMake.createPdf(docDefinition).download('Reporte_Control.pdf');
    const today: Date = new Date();
    this.logService.insertLogsAsync({
      description: "Generación Reporte PDF Reporte_Control:",
      user: this.user,
      date: today.toISOString()
    }).subscribe(message => { });
  }

  pdf5(): void {
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

    // Calcular sumatorias
    const contractMountSum = this.listOfDisplayData2.reduce((sum, item) => sum + (item.contracT_MOUNT ?? 0), 0);
    const totalEarningsSum = this.listOfDisplayData2.reduce((sum, item) => sum + (item.totaL_EARNINGS ?? 0), 0);


    // Crear el contenido de la tabla con el formato de moneda
    const tableBody = [
      // Definir encabezados de la tabla (11 columnas)
      [
        'IdProyecto',
        'Cliente',
        'Tipo de Trabajo',
        'Monto de Contrato',
        'Monto Total Ingresos',
        'Tipo de Monto',
        'Fecha Inicio',
        'Fecha Fin',
        'Fecha de Pago',
        'Fecha de Aprobación',
        '¿Pagado?'
      ],
      // Agregar cada fila a la tabla con el formato condicional
      ...this.listOfDisplayData2.map(item => [
        item.iD_PROJECT ?? '-', // Si el valor no existe, asignar '-'
        item.clienT_NAME ?? '-',
        item.typE_WORK_NAME ?? '-',
        formatNumber(item.contracT_MOUNT ?? 0), // Formatear el monto del contrato (valor por defecto 0)
        formatNumber(item.totaL_EARNINGS ?? 0), // Formatear el monto del contrato (valor por defecto 0)
        item.typE_MOUNT ?? '-',
        item.datE_BEGIN ? new Date(item.datE_BEGIN).toLocaleDateString('es-CR') : '-', // Formatear fecha o asignar '-'
        item.datE_END ? new Date(item.datE_END).toLocaleDateString('es-CR') : '-', // Formatear fecha o asignar '-'
        item.datE_EARNING ? new Date(item.datE_EARNING).toLocaleDateString('es-CR') : '-', // Formatear fecha o asignar '-'
        item.datE_APROBATION ? new Date(item.datE_APROBATION).toLocaleDateString('es-CR') : '-', // Formatear fecha o asignar '-'
        item.pagado // Mostrar si está pagado o no
      ]),
      // Agregar fila de sumatorias
      ['Total', '', '', formatNumber(contractMountSum), formatNumber(totalEarningsSum), '', '', '', '', '', '']
    ];

    // Ajustar los anchos de las columnas (11 columnas)
    const widths = Array(11).fill('auto'); // Crear un array con 11 elementos con ancho 'auto'

    const status = this.payment.find(item => item.value === this.reportPay.value.status);

    const text = 'Reporte de Estado de Proyectos ' + status.label + ' - ' + this.reportPay.value.year;

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
    pdfMake.createPdf(docDefinition).download('Reporte_Estado_Proyectos.pdf');
    const today: Date = new Date();
    this.logService.insertLogsAsync({
      description: "Generación Reporte PDF Reporte_Estado_Proyectos:",
      user: this.user,
      date: today.toISOString()
    }).subscribe(message => { });
  }

  pdf6(): void {
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

    // Calcular sumatorias
    const contractMountSum = this.listOfDisplayData.reduce((sum, item) => sum + (item.contracT_MOUNT ?? 0), 0);
    const totalEarningsSum = this.listOfDisplayData.reduce((sum, item) => sum + (item.totaL_EARNINGS ?? 0), 0);

    // Crear el contenido de la tabla con el formato de moneda
    const tableBody = [
      // Definir encabezados de la tabla (11 columnas)
      [
        'IdProyecto',
        'Cliente',
        'Tipo de Trabajo',
        'Monto de Contrato',
        'Monto Total Ingresos',
        'Tipo de Monto',
        'Fecha Inicio',
        'Fecha Fin',
        'Fecha de Pago',
        'Fecha de Aprobación',
        '¿Pagado?'
      ],
      // Agregar cada fila a la tabla con el formato condicional
      ...this.listOfDisplayData.map(item => [
        item.iD_PROJECT ?? '-', // Si el valor no existe, asignar '-'
        item.clienT_NAME ?? '-',
        item.typE_WORK_NAME ?? '-',
        formatNumber(item.contracT_MOUNT ?? 0),
        formatNumber(item.totaL_EARNINGS ?? 0),
        item.typE_MOUNT ?? '-',
        item.datE_BEGIN ? new Date(item.datE_BEGIN).toLocaleDateString('es-CR') : '-',
        item.datE_END ? new Date(item.datE_END).toLocaleDateString('es-CR') : '-',
        item.datE_EARNING ? new Date(item.datE_EARNING).toLocaleDateString('es-CR') : '-',
        item.datE_APROBATION ? new Date(item.datE_APROBATION).toLocaleDateString('es-CR') : '-',
        item.pagado
      ]),
      // Agregar fila de sumatorias
      ['Total', '', '', formatNumber(contractMountSum), formatNumber(totalEarningsSum), '', '', '', '', '', '']
    ];

    // Ajustar los anchos de las columnas (11 columnas)
    const widths = Array(11).fill('auto'); // Crear un array con 11 elementos con ancho 'auto'

    const text = 'Reporte de Estado de Proyectos ' + this.reportMonth.value.dateBegin + ' - ' + this.reportMonth.value.dateEnd;

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
    pdfMake.createPdf(docDefinition).download('Reporte_Estado_Proyectos.pdf');
    const today: Date = new Date();
    this.logService.insertLogsAsync({
      description: "Generación Reporte PDF Reporte_Estado_Proyectos:",
      user: this.user,
      date: today.toISOString()
    }).subscribe(message => { });
  }

  pdf7(): void {
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

    // Calcular sumatorias
    const contractMountSum = this.listOfDisplayData3.reduce((sum, item) => sum + (item.contracT_MOUNT ?? 0), 0);
    const totalEarningsSum = this.listOfDisplayData3.reduce((sum, item) => sum + (item.totaL_EARNINGS ?? 0), 0);

    // Crear el contenido de la tabla con el formato de moneda
    const tableBody = [
      // Definir encabezados de la tabla (11 columnas)
      [
        'IdProyecto',
        'Cliente',
        'Tipo de Trabajo',
        'Monto de Contrato',
        'Monto Total Ingresos',
        'Tipo de Monto',
        'Fecha Inicio',
        'Fecha Fin',
        'Fecha de Pago',
        'Fecha de Aprobación',
        '¿Pagado?'
      ],
      // Agregar cada fila a la tabla con el formato condicional
      ...this.listOfDisplayData3.map(item => [
        item.iD_PROJECT ?? '-', // Si el valor no existe, asignar '-'
        item.clienT_NAME ?? '-',
        item.typE_WORK_NAME ?? '-',
        formatNumber(item.contracT_MOUNT ?? 0),
        formatNumber(item.totaL_EARNINGS ?? 0),
        item.typE_MOUNT ?? '-',
        item.datE_BEGIN ? new Date(item.datE_BEGIN).toLocaleDateString('es-CR') : '-',
        item.datE_END ? new Date(item.datE_END).toLocaleDateString('es-CR') : '-',
        item.datE_EARNING ? new Date(item.datE_EARNING).toLocaleDateString('es-CR') : '-',
        item.datE_APROBATION ? new Date(item.datE_APROBATION).toLocaleDateString('es-CR') : '-',
        item.pagado
      ]),
      // Agregar fila de sumatorias
      ['Total', '', '', formatNumber(contractMountSum), formatNumber(totalEarningsSum), '', '', '', '', '', '']
    ];

    // Ajustar los anchos de las columnas (11 columnas)
    const widths = Array(11).fill('auto'); // Crear un array con 11 elementos con ancho 'auto'

    const typeWork = this.typeworkList.find(item => item.id_type_work === this.report3.value.typeWork);
    const client = this.clientList.find(item => item.id_client === this.report3.value.client);

    const text = 'Reporte de Estado de Proyectos ' + typeWork?.name + ' - '
      + client?.name + ' - ' + this.report3.value.dateBegin + ' - ' + this.report3.value.dateEnd;

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
    pdfMake.createPdf(docDefinition).download('Reporte_Estado_Proyectos.pdf');
    const today: Date = new Date();
    this.logService.insertLogsAsync({
      description: "Generación Reporte PDF Reporte_Estado_Proyectos:",
      user: this.user,
      date: today.toISOString()
    }).subscribe(message => { });
  }

  pdf8(): void {
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
        return 'No se encuentran registrados ingresos en estas fechas';
      }
    };

    // Calcular sumatorias
    const totalSum = this.listOfDataControlClients.reduce((sum, item) => sum + (item.total_Ingresos ?? 0), 0);
    const missingAmountSum = this.listOfDataControlClients.reduce((sum, item) => sum + (item.monto_Faltante ?? 0), 0);

    // Crear el contenido de la tabla con el formato de moneda
    const tableBody = [
      // Definir encabezados de la tabla 
      ['Cliente', 'Ingreso Total', 'Monto Faltante'],
      // Agregar cada fila a la tabla con el formato condicional
      ...this.listOfDataControlClients.map(item => [
        item.name ?? '-',
        formatNumber(item.total_Ingresos),
        formatNumber(item.monto_Faltante)
      ]),
      // Agregar fila de sumatorias
      ['Total', formatNumber(totalSum), formatNumber(missingAmountSum)]
    ];

    // Aplicar la función a las fechas
    const text = 'Reporte de Control de Clientes ' + this.reportControlClients.value.year + ' - ('
      + this.reportControlClients.value.dateBegin
      + ' | '
      + this.reportControlClients.value.dateEnd + ')';

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
            widths: ['*', 'auto', 'auto'], // Ajustar los anchos de las tres columnas
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
    pdfMake.createPdf(docDefinition).download('Reporte_Control_Clientes.pdf');
    const today: Date = new Date();
    this.logService.insertLogsAsync({
      description: "Generación Reporte PDF Reporte_Control_Clientes:",
      user: this.user,
      date: today.toISOString()
    }).subscribe(message => { });
  }

  pdf9(): void {
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

    // Calcular sumatorias
    const contractMountSum = this.listOfDataSector.reduce((sum, item) => sum + (item.contracT_MOUNT ?? 0), 0);
    const totalEarningsSum = this.listOfDataSector.reduce((sum, item) => sum + (item.totaL_EARNINGS ?? 0), 0);

    // Crear el contenido de la tabla con el formato de moneda
    const tableBody = [
      // Definir encabezados de la tabla (11 columnas)
      [
        'IdProyecto',
        'Cliente',
        'Tipo de Trabajo',
        'Monto de Contrato',
        'Monto Total Ingresos',
        'Tipo de Monto',
        'Fecha Inicio',
        'Fecha Fin',
        'Fecha de Pago',
        'Fecha de Aprobación',
        '¿Pagado?'
      ],
      // Agregar cada fila a la tabla con el formato condicional
      ...this.listOfDataSector.map(item => [
        item.iD_PROJECT ?? '-', // Si el valor no existe, asignar '-'
        item.clienT_NAME ?? '-',
        item.typE_WORK_NAME ?? '-',
        formatNumber(item.contracT_MOUNT ?? 0),
        formatNumber(item.totaL_EARNINGS ?? 0),
        item.typE_MOUNT ?? '-',
        item.datE_BEGIN ? new Date(item.datE_BEGIN).toLocaleDateString('es-CR') : '-',
        item.datE_END ? new Date(item.datE_END).toLocaleDateString('es-CR') : '-',
        item.datE_EARNING ? new Date(item.datE_EARNING).toLocaleDateString('es-CR') : '-',
        item.datE_APROBATION ? new Date(item.datE_APROBATION).toLocaleDateString('es-CR') : '-',
        item.pagado
      ]),
      // Agregar fila de sumatorias
      ['Total', '', '', formatNumber(contractMountSum), formatNumber(totalEarningsSum), '', '', '', '', '', '']
    ];

    const widths = Array(11).fill('auto'); // Crear un array con 11 elementos con ancho 'auto'

    const text = 'Reporte de Estado de Proyectos Por Sector ' + this.reportSector.value.sector
      + ' - ' + this.reportSector.value.dateBegin + ' - ' + this.reportSector.value.dateEnd;

    const docDefinition = {
      pageOrientation: 'landscape',
      content: [
        {
          text: text,
          style: 'header',
          alignment: 'center',
          margin: [0, 50, 0, 10]
        },
        {
          style: 'tableExample',
          table: {
            widths: widths,
            body: tableBody
          },
          alignment: 'center',
          margin: [0, 10, 0, 10]
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
          margin: [0, 5, 0, 15]
        }
      },
      header: {
        image: headerImageBase64,
        width: 300,
        alignment: 'center',
        margin: [0, 10, 0, 10]
      },
      footer: (currentPage, pageCount) => {
        return {
          columns: [
            {
              image: footerImageBase64,
              width: 300,
              alignment: 'center',
              margin: [0, -25, -100, 10]
            },
            {
              text: `Página ${currentPage} de ${pageCount}`,
              alignment: 'right',
              margin: [0, 0, 40, 10]
            }
          ]
        };
      }
    };

    // Crear y descargar el PDF
    pdfMake.createPdf(docDefinition).download('Reporte_Estado_Proyectos.pdf');
    const today: Date = new Date();
    this.logService.insertLogsAsync({
      description: "Generación Reporte PDF Reporte_Estado_Proyectos:",
      user: this.user,
      date: today.toISOString()
    }).subscribe(message => { });
  }


}
