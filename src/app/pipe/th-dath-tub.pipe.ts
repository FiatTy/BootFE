import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'thDathTub'
})
export class ThDathTubPipe implements PipeTransform {

  transform(value: any) {
    if (!this.checkNull(value)) {
      let date = new Date(value);
      const days = ['อาทิตย์', 'จันทร์', 'อังคาร', 'พุธ', 'พฤหัสบดี', 'ศุกร์', 'เสาร์'];
      const months = ['มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน', 'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'];
      let dayName = days[date.getDay()];
      let day = date.getDate();
      let month = months[date.getMonth()];
      let year = date.getFullYear() + 543; // แปลง ค.ศ. เป็น พ.ศ.
      return `วัน${dayName}ที่ ${day} เดือน${month} พ.ศ. ${year}`;
    } else {
      return value == null || value == '' || value == '-' || value == ' ' ? '-' : value;
    }
  }
  checkNull(str: any): boolean {
    if (str === null) return true;
    if (str === undefined) return true;
    if (str === '') return true;
    if (str === '-') return true;
    if (str === '') return true;
    return false;

  }

}
