import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'thDate'
})
export class ThDatePipe implements PipeTransform {

  transform(value: any, format: string = 'short'): string {
    if (!value) return '-';

    const date = new Date(value);

    if (isNaN(date.getTime())) {
      return 'isTime';
    }

    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear() + 543; 
    
    return `${day}/${month}/${year}`;
  }

}
