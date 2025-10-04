import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'fechaEspanol'
})
export class FechaEspanolPipe implements PipeTransform {
    transform(value: any): string {
        if (!value) return '';

        const fecha = new Date(value);
        const dias = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
        const meses = [
            'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
            'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
        ];

        const diaSemana = dias[fecha.getDay()];
        const dia = fecha.getDate();
        const mes = meses[fecha.getMonth()];
        const año = fecha.getFullYear();

        return `${diaSemana}, ${dia} de ${mes} ${año}`;
    }
}