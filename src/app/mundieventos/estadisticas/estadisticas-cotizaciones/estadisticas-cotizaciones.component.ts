// angular import
import { Component, OnInit, OnDestroy, inject, ChangeDetectorRef, EventEmitter, Output, Input, SimpleChanges } from '@angular/core';
import { ReactiveFormsModule, FormsModule, FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';

// project import
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { ApexOptions, NgApexchartsModule } from 'ng-apexcharts';

// Servicio:
import { CotizacionesService } from '../../services/cotizador/cotizador.service'
import { CotizacionInterface } from '../../models/cotizaciones.model';
import { ClientesInterface } from '../../models/clientes.models';
import { months, years } from '../../utils/filtros';

@Component({
  selector: 'app-estadisticas-cotizaciones',
  standalone: true,
  imports: [SharedModule, FormsModule, RouterModule, CommonModule, NgApexchartsModule],
  templateUrl: './estadisticas-cotizaciones.component.html',
  styleUrls: ['./estadisticas-cotizaciones.component.scss']
})
export class EstadisticasCotizacionesComponent implements OnInit, OnDestroy {

  private cotizacionesService = inject(CotizacionesService);

  cotizaciones: CotizacionInterface[] = [];
  clientes: ClientesInterface[] = [];
  chartDB: any;

  lastDate!: number;
  data: any;
  intervalSub: any;
  intervalMain: any;
  pie1CAC: ApexOptions = {
    chart: {
      height: 320,
      type: 'pie'
    },
    labels: [],
    series: [],
    colors: [],
    legend: {
      show: true,
      position: 'bottom'
    },
    dataLabels: {
      enabled: true,
      dropShadow: {
        enabled: false
      }
    },
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: {
            width: 200
          },
          legend: {
            position: 'bottom'
          }
        }
      }
    ]
  };

  pie2CAC: ApexOptions = {
    chart: {
      height: 320,
      type: 'donut'
    },
    series: [],
    labels: [],
    colors: [],
    legend: {
      show: true,
      position: 'bottom'
    },
    plotOptions: {
      pie: {
        donut: {
          labels: {
            show: true,
            name: {
              show: true
            },
            value: {
              show: true
            }
          }
        }
      }
    },
    dataLabels: {
      enabled: true,
      dropShadow: {
        enabled: false
      }
    },
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: {
            width: 200
          },
          legend: {
            position: 'bottom'
          }
        }
      }
    ]
  };

  filterForm: FormGroup;
  months = months;  // Usamos los meses importados
  years = years;    // Usamos los años importados

  // constructor
  constructor(private cdr: ChangeDetectorRef, private fb: FormBuilder) {
    this.lastDate = 0;
    this.data = [];
    this.getDayWiseTimeSeries(new Date('11 Feb 2017 GMT').getTime(), 10, { min: 10, max: 90 });

    this.filterForm = this.fb.group({
      month: [new Date().getMonth() + 1], // Mes actual
      year: [new Date().getFullYear()], // Año actual
    });
  }

  // life cycle event
  ngOnInit() {
    this.getCotizaciones();
    this.intervalSub = setInterval(() => {
      this.getNewSeries(this.lastDate, { min: 10, max: 90 });
    }, 1000);

    this.intervalMain = setInterval(() => {
      this.resetData();
    }, 30000);
  }

  ngOnDestroy() {
    if (this.intervalSub) {
      clearInterval(this.intervalSub);
    }
    if (this.intervalMain) {
      clearInterval(this.intervalMain);
    }
  }

  // public method
  getDayWiseTimeSeries(baseval: number, count: number, yrange: { min: number; max: number }) {
    let i = 0;
    while (i < count) {
      const x = baseval;
      const y = Math.floor(Math.random() * (yrange.max - yrange.min + 1)) + yrange.min;

      this.data.push({ x, y });
      this.lastDate = baseval;
      baseval += 86400000;
      i++;
    }
  }

  resetData() {
    this.data = this.data.slice(this.data.length - 10, this.data.length);
  }

  getNewSeries(baseval: number, yrange: { min: number; max: number }) {
    const newDate = baseval + 86400000;
    this.lastDate = newDate;
    this.data.push({
      x: newDate,
      y: Math.floor(Math.random() * (yrange.max - yrange.min + 1)) + yrange.min
    });
  }

  getCotizaciones(): void {
    const year = this.filterForm.get('year')?.value;
    const month = this.filterForm.get('month')?.value;

    console.log("Filtrando por año:", year, "y mes:", month);

    this.cotizacionesService.getCotizacionesPorFecha(year, month).subscribe({
      next: (data) => {
        this.cotizaciones = data;
        this.procesarDatosParaGrafico(); // Procesar los datos para los gráficos

        // Forzar la detección de cambios para actualizar la vista
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error en la búsqueda de cotizaciones:', error);
      },
    });
  }

  private procesarDatosParaGrafico() {
    const estadoCounts: Record<string, { count: number; color: string }> = {};

    this.cotizaciones.forEach(cotizacion => {
      const estado = cotizacion.estado_info.item;
      const color = cotizacion.estado_info.color;

      if (!estadoCounts[estado]) {
        estadoCounts[estado] = { count: 0, color: color };
      }

      estadoCounts[estado].count += 1; // Incrementamos el contador de cotizaciones por estado
    });

    const labels = Object.keys(estadoCounts); // Estados como etiquetas
    const series = Object.values(estadoCounts).map(item => item.count); // Cantidad de cotizaciones por estado
    const colors = Object.values(estadoCounts).map(item => item.color); // Colores según el estado

    this.pie1CAC = {
      ...this.pie1CAC,
      labels: labels,
      series: series,
      colors: colors,
    };

    this.pie2CAC = {
      ...this.pie2CAC,
      labels: labels,
      series: series,
      colors: colors,
    };
    this.cdr.detectChanges();
  }

}