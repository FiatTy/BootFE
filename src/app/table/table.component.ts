import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { BsDatepickerDirective, BsLocaleService } from 'ngx-bootstrap/datepicker';
import { defineLocale } from 'ngx-bootstrap/chronos';
import { thLocale } from 'ngx-bootstrap/locale';
import { HttpClient } from '@angular/common/http';
import * as echarts from 'echarts';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css']
})
export class TableComponent implements OnInit {

  @ViewChild('exampleModal') exampleModal!: ModalDirective;

  // ค้ารับเข้าจาก modal
  inputFirstname: string = '';
  inputLastname: string = '';
  inputBirthdate?: Date;
  inputGender: string = 'เลือกเพศ';

  // ค้าฟิวเตอร์
  filterUserPass: string = '';
  filterName: string = '';
  filterAge: number | null = null;
  filterGender: string = 'เลือกเพศ';
  filterCreateBy: string = '';

  dateValuefitter?: Date;
  datecreatefitter?: Date;

  // เช็คโหมด
  isEditMode: boolean = false;
  currentEditId: number = 0;

  userslist: any[] = [
    { id: 1, userpass: "17", firstname: "ไก่งาม", lastname: "เพราะขน", birthdate: new Date(1997, 6, 14), age: 24, gender: "ชาย", createdate: new Date(2021, 11, 23), createby: "Fiat" },
    { id: 2, userpass: "125", firstname: "คนงาม", lastname: "เพราะแต่ง", birthdate: new Date(1975, 11, 19), age: 50, gender: "อื่นๆ", createdate: new Date(2021, 0, 15), createby: "Fiat" },
    { id: 3, userpass: "55", firstname: "ขี่ช้าง", lastname: "จับตั๊กแตน", birthdate: new Date(1983, 10, 13), age: 38, gender: "หญิง", createdate: new Date(2021, 4, 13), createby: "Fiat" },
    { id: 4, userpass: "33", firstname: "น้ำขึ้น", lastname: "ให้รีบตัก", birthdate: new Date(2003, 7, 6), age: 18, gender: "ชาย", createdate: new Date(2021, 8, 16), createby: "Fiat" },
    { id: 5, userpass: "98", firstname: "สีซอ", lastname: "ให้ควายฟัง", birthdate: new Date(1986, 1, 8), age: 35, gender: "อื่นๆ", createdate: new Date(2021, 9, 4), createby: "Fiat" },
    { id: 6, userpass: "20", firstname: "จับปลา", lastname: "สองมือ", birthdate: new Date(1986, 10, 25), age: 35, gender: "อื่นๆ", createdate: new Date(2021, 3, 11), createby: "Fiat" },
    { id: 7, userpass: "52", firstname: "เข็นครก", lastname: "ขึ้นภูเขา", birthdate: new Date(2002, 2, 6), age: 19, gender: "หญิง", createdate: new Date(2021, 2, 19), createby: "Fiat" },
    { id: 8, userpass: "76", firstname: "ดินพอก", lastname: "หางหมู", birthdate: new Date(1986, 4, 14), age: 35, gender: "อื่นๆ", createdate: new Date(2021, 2, 21), createby: "Fiat" },
    { id: 9, userpass: "79", firstname: "วัวหาย", lastname: "ล้อมคอก", birthdate: new Date(1982, 9, 21), age: 39, gender: "หญิง", createdate: new Date(2021, 6, 17), createby: "Fiat" },
    { id: 10, userpass: "114", firstname: "ผักชี", lastname: "โรยหน้า", birthdate: new Date(1997, 11, 3), age: 24, gender: "ชาย", createdate: new Date(2021, 7, 27), createby: "Fiat" },
    { id: 11, userpass: "65", firstname: "ปิดทอง", lastname: "หลังพระ", birthdate: new Date(1996, 3, 9), age: 25, gender: "ชาย", createdate: new Date(2021, 9, 1), createby: "Fiat" },
    { id: 12, userpass: "32", firstname: "หัวล้าน", lastname: "ได้หวี", birthdate: new Date(1992, 5, 22), age: 29, gender: "อื่นๆ", createdate: new Date(2021, 6, 14), createby: "Fiat" },
    { id: 13, userpass: "4", firstname: "ตาบอด", lastname: "ได้แว่น", birthdate: new Date(1999, 3, 18), age: 22, gender: "อื่นๆ", createdate: new Date(2021, 0, 18), createby: "Fiat" },
  ];

  filteredList: any[] = [];

  maleCount: number = 0;
  femaleCount: number = 0;
  otherCount: number = 0;

  ageRange1: number = 0; // 0 - 20 
  ageRange2: number = 0; // 21 - 30 
  ageRange3: number = 0; // 31 - 40
  ageRange4: number = 0; // 41+

  TestFiat: Date = new Date(2025, 0, 1);

  constructor(private localeService: BsLocaleService , private http: HttpClient) {
    defineLocale('th', thLocale);
    this.localeService.use('th');
  }

  ngOnInit(): void {
    this.filteredList = [...this.userslist];
    this.updateGraphData();
    this.callApi();
    console.log(this.TestFiat);
  }

  // ฟังก์ค้นหา
  onSearch() {
    this.filteredList = this.userslist.filter(user => {

      // เช็ครหัส
      let matchPass = true;
      if (this.filterUserPass) { 
        matchPass = user.userpass.includes(this.filterUserPass);
      }

      // ชื่อ
      let matchName = true;
      if (this.filterName) {
        let fullName = user.firstname + " " + user.lastname;
        matchName = fullName.includes(this.filterName);
      }

      // เช็คเพศ
      let matchGender = true;
      if (this.filterGender !== 'เลือกเพศ') {
        matchGender = user.gender === this.filterGender;
      }

      // อายุ
      let matchAge = true;
      if (this.filterAge) {
        matchAge = user.age == this.filterAge;
      }

      // เช็คคนบันทึก
      let matchCreateBy = true;
      if (this.filterCreateBy) {
        matchCreateBy = user.createby.includes(this.filterCreateBy);
      }

      // เช็ควันเกิด
      let matchBirthdate = true;
      if (this.dateValuefitter != null) {
        if (user.birthdate != null) {

          let d1 = user.birthdate.getDate();
          let m1 = user.birthdate.getMonth();
          let y1 = user.birthdate.getFullYear();

          let d2 = this.dateValuefitter.getDate();
          let m2 = this.dateValuefitter.getMonth();
          let y2 = this.dateValuefitter.getFullYear();

          if (d1 == d2 && m1 == m2 && y1 == y2) {
            matchBirthdate = true;
          } else {
            matchBirthdate = false;
          }
        } else {
          matchBirthdate = false;
        }
      }

      // เช็ควันที่บันทึก
      let matchCreateDate = true;
      if (this.datecreatefitter != null) {
        if (user.createdate != null) {

          let d_user = user.createdate.getDate();
          let m_user = user.createdate.getMonth();
          let y_user = user.createdate.getFullYear();

          let d_filter = this.datecreatefitter.getDate();
          let m_filter = this.datecreatefitter.getMonth();
          let y_filter = this.datecreatefitter.getFullYear();

          if (d_user == d_filter && m_user == m_filter && y_user == y_filter) {
            matchCreateDate = true;
          } else {
            matchCreateDate = false;
          }
        } else {
          matchCreateDate = false;
        }
      }
      return matchPass && matchName && matchGender && matchAge && matchCreateBy && matchBirthdate && matchCreateDate;
    });
  }

  // ฟังก์รัเซ็ต
  onReset() {
    this.filterUserPass = '';
    this.filterName = '';
    this.filterAge = null;
    this.filterGender = 'เลือกเพศ';
    this.filterCreateBy = '';
    this.dateValuefitter = undefined;
    this.datecreatefitter = undefined;

    this.filteredList = [...this.userslist];
  }

  // ฟังก์เพิ่ม
  onClickAdd() {
    this.isEditMode = false;
    this.inputFirstname = '';
    this.inputLastname = '';
    this.inputBirthdate = undefined;
    this.inputGender = 'เลือกเพศ';
    this.exampleModal.show();
  }

  // ฟังก์แก้ไข
  onClickEdit(user: any) {
    this.isEditMode = true;
    this.currentEditId = user.id;
    this.inputFirstname = user.firstname;
    this.inputLastname = user.lastname;
    this.inputBirthdate = user.birthdate;
    this.inputGender = user.gender;
    this.exampleModal.show();
  }

  // ฟังก์บันทึก
  onSave() {
    let ageCalculated = this.calAge(this.inputBirthdate);

    if (this.isEditMode == true) {

      //แก้ไข
      for (let i = 0; i < this.userslist.length; i++) {
        if (this.userslist[i].id == this.currentEditId) {
          this.userslist[i].firstname = this.inputFirstname;
          this.userslist[i].lastname = this.inputLastname;
          this.userslist[i].birthdate = this.inputBirthdate;
          this.userslist[i].gender = this.inputGender;
          this.userslist[i].age = ageCalculated;
          break;
        }
      }
    } else {

      let newId;

      let count = this.userslist.length;

      if (count == 0) {
        newId = 1;
      } else {
        let lastUser = this.userslist[count - 1];
        newId = lastUser.id + 1;
      }

      let randomPass = Math.floor(Math.random() * 150) + 1;

      let newUser = {
        id: newId,
        userpass: randomPass.toString(),
        firstname: this.inputFirstname,
        lastname: this.inputLastname,
        birthdate: this.inputBirthdate,
        age: ageCalculated,
        gender: this.inputGender,
        createdate: new Date(),
        createby: "Fiat"
      };
      
      this.userslist.push(newUser);
    }

    this.filteredList = [...this.userslist];

    this.updateGraphData();
    this.exampleModal.hide();
  }

  // ฟังก์ลบ
  onClickDelete(id: number) {
    if (confirm("แน่ใจรึปล่าวนะนนนนนน")) {
      for (let i = 0; i < this.userslist.length; i++) {
        if (this.userslist[i].id == id) {
          this.userslist.splice(i, 1);
          break;
        }
      }
      
      this.filteredList = [...this.userslist];
      this.updateGraphData();
    }
  }

  calAge(birthday: any) {
    if (birthday == null) return 0;
    let today = new Date();
    let birthDate = new Date(birthday);
    let age = today.getFullYear() - birthDate.getFullYear();
    let m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (today.getDate() < birthDate.getDate())) {
      age--;
    }
    if (age < 0) {
      age = 0;
    };
    return age;
  }

  updateGraphData() {

    this.maleCount = 0;
    this.femaleCount = 0;
    this.otherCount = 0;

    this.ageRange1 = 0;
    this.ageRange2 = 0;
    this.ageRange3 = 0;
    this.ageRange4 = 0;

    // นับเพศ และ อายุ
    for (let user of this.userslist) {
      if (user.gender == 'ชาย') this.maleCount++;
      else if (user.gender == 'หญิง') this.femaleCount++;
      else this.otherCount++;

      let age = user.age;
      if (age <= 20) {
        this.ageRange1++;
      } else if (age > 20 && age <= 30) {
        this.ageRange2++;
      } else if (age > 30 && age <= 40) {
        this.ageRange3++;
      } else {
        this.ageRange4++;
      }
    }

    this.setupPieChart();
    this.setupBarChart();

  }

  // กราฟวงกลม
  setupPieChart() {
    type EChartsOption = echarts.EChartsOption;
    var chartDom = document.getElementById('pieChart');
    if (!chartDom) return;
    var myChart = echarts.getInstanceByDom(chartDom);
    if (myChart) myChart.dispose();
    myChart = echarts.init(chartDom);

    var option: EChartsOption = {
      title: { text: 'กราฟแสดงผู้ใช้งานแยกตามเพศ', subtext: 'Fake Data', left: 'center' },
      tooltip: { trigger: 'item' },
      legend: { top: "Top", orient: 'vertical', left: 'left' },
      series: [
        {
          name: 'Access From',
          type: 'pie',
          radius: '50%',
          data: [
            { value: this.maleCount, name: 'ผู้ชาย' },
            { value: this.femaleCount, name: 'ผู้หญิง' },
            { value: this.otherCount, name: 'อื่นๆ' }
          ],
          emphasis: { itemStyle: { shadowBlur: 10, shadowOffsetX: 0, shadowColor: 'rgba(0, 0, 0, 0.5)' } }
        }
      ]
    };
    option && myChart.setOption(option);
  }

  // กราฟแท่ง
  setupBarChart() {
    var chartDom = document.getElementById('barChart');
    var myChart = echarts.init(chartDom);
    var option;

    option = {
      title: {
        text: 'กราฟแสดงผู้ใช้งานตามช่วงอายุ',
        subtext: 'Fake Data',
        left: 'center'
      },
      legend: {
        top: "bottom"
      },
      tooltip: {
        trigger: 'item',
        axisPointer: {
          type: 'shadow'
        }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '10%',
        containLabel: true
      },
      xAxis: [
        {
          type: 'category',
          data: ['จำนวนช่วงอายุ'],
          axisTick: {
            alignWithLabel: true
          }
        }
      ],
      yAxis: [
        {
          type: 'value'
        }
      ],
      series: [
        {
          name: '0-20 ปี',
          type: 'bar',
          data: [this.ageRange1]
        },
        {
          name: '21-30 ปี',
          type: 'bar',
          data: [this.ageRange2]
        },
        {
          name: '31-40 ปี',
          type: 'bar',
          data: [this.ageRange3]
        },
        {
          name: '41+ ปี',
          type: 'bar',
          data: [this.ageRange4]
        }
      ]
    };

    option && myChart.setOption(option);
  }

  callApi(){
    this.http.get<any>(
      environment.fiatUserServiceUrl + '/fiat-users-controller/get-data-all', {}
    ).toPromise().then((response) => {
      console.log(response);
    });
  }
}