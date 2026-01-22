import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { BsDatepickerDirective, BsLocaleService } from 'ngx-bootstrap/datepicker';
import { defineLocale } from 'ngx-bootstrap/chronos';
import { thBeLocale } from 'ngx-bootstrap/locale';
import { HttpClient } from '@angular/common/http';
import * as echarts from 'echarts';
import { environment } from 'src/environments/environment';


@Component({
  selector: 'app-tablebackend',
  templateUrl: './tablebackend.component.html',
  styleUrls: ['./tablebackend.component.css']
})
export class TablebackendComponent implements OnInit {

  @ViewChild('exampleModal') exampleModal!: ModalDirective;

  charname: string = 'ABCD';

  // ค้ารับเข้าจาก modal
  inputFirstname: string = '';
  inputLastname: string = '';
  inputBirthdate?: Date;
  inputGender: string = 'เลือกเพศ';

  // ค้าฟิวเตอร์
  filterId: string = '';
  filterBirthday?: Date;
  filterFullName: string = '';
  filterGender: string = 'เลือกเพศ';
  filterAge: string = '';
  filterUpdateBy: string = '';
  filterUpdateDate?: Date;

  // เช็คโหมด
  isEditMode: boolean = false;
  currentEditId: number = 0;

  userslist: any[] = [];


  maleCount: number = 0;
  femaleCount: number = 0;
  otherCount: number = 0;

  ageRange1: number = 0; // 0 - 20 
  ageRange2: number = 0; // 21 - 30 
  ageRange3: number = 0; // 31 - 40
  ageRange4: number = 0; // 41+


  constructor(private localeService: BsLocaleService, private http: HttpClient) {
    defineLocale('th', thBeLocale);
    this.localeService.use('th');
  }

  ngOnInit(): void {
    this.updateGraphData();
    this.loaddata();
  }

  onSearch() {
    const params: any = {};

    if (this.filterId) {
       params.id = this.filterId;
    }


    if (this.filterFullName) {
       params.firstname = this.filterFullName.trim();
    }


    if (this.filterAge) {
       params.age = this.filterAge;
    }


    if (this.filterGender && this.filterGender !== 'เลือกเพศ') {
      params.gender = this.filterGender;
    }


    if (this.filterBirthday) {
      params.birthday = this.formatAsYYYYMMDD(this.filterBirthday);
    }


    if (this.filterUpdateDate) {
      params.updateDate = this.formatAsYYYYMMDD(this.filterUpdateDate);
    }


    if (this.filterUpdateBy) {
      params.updateBy = this.filterUpdateBy.trim();
    }

    this.findAllApi(params);

  }

  onReset() {
    this.filterId = '';
    this.filterBirthday = undefined;
    this.filterFullName = '';
    this.filterGender = 'เลือกเพศ';
    this.filterAge = '';
    this.filterUpdateBy = '';
    this.filterUpdateDate = undefined;

    this.loaddata();
  }

  // ฟังก์เพิ่ม
  onClickAdd() {
    this.isEditMode = false;
    this.currentEditId = 0;
    this.inputFirstname = '';
    this.inputLastname = '';
    this.inputBirthdate = undefined;
    this.inputGender = 'เลือกเพศ';
    this.exampleModal.show();
  }

  // ฟังก์แก้ไข
  onClickEdit(id: number) {
    this.isEditMode = true;
    this.currentEditId = id;
    this.getdataEditApi(id);
    this.exampleModal.show();
  }

  testEdit(user: any){
    console.log(user);
  }

  // ฟังก์บันทึก
  onSave() {

    const params: any = {
      firstname: this.inputFirstname,
      lastname: this.inputLastname,
      birthday: this.formatAsYYYYMMDD(this.inputBirthdate!),
      age: this.calAge(this.inputBirthdate), 
      gender: this.inputGender,
    }

    if (this.isEditMode == true) {
      params.id = this.currentEditId;
      this.editDataApi(params);
      this.exampleModal.hide();

      
    }else {
      this.postDataApi(params);
      this.exampleModal.hide();

    }


  }

  // ฟังก์ลบ
  onClickDelete(id: number) {
    if (confirm("แน่ใจรึปล่าวนะนนนนนน")) {
      this.deleteDataApi(id);
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

    console.log('Data for Graph: ', this.userslist);

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

  loaddata() {
    this.http.get<any>(
      environment.fiatUserServiceUrl + '/fiat-users-controller/get-data-all', {}
    ).toPromise().then((response) => {
      console.log('Get Data: ', response);

      this.userslist = response;

      this.userslist.forEach(user => {
        if (user.birthday) {
          user.birthday = new Date(user.birthday);
        }
        if (user.createDate) {
          user.createDate = new Date(user.createDate);
        }
        if (user.updateDate) {
          user.updateDate = new Date(user.updateDate);
        }
      });

      this.updateGraphData();

    });
  }

  getdataEditApi(id: number) {
    this.http.get<any[]>(
      environment.fiatUserServiceUrl + '/fiat-users-controller/get-data-old-by-id', { params: { id: id.toString() } }
    ).toPromise().then((response) => {
      console.log('Get Data old: ', response);

      const user = response[0];
      this.inputFirstname = user.firstname;
      this.inputLastname = user.lastname;
      this.inputGender = user.gender;
      if (user.birthday) {
        this.inputBirthdate = new Date(user.birthday);
      } else {
        this.inputBirthdate = undefined;
      }

    });
  }

  editDataApi(params: any) {
    this.http.put<any>(
      environment.fiatUserServiceUrl + '/fiat-users-controller/put-data', params
    ).toPromise().then((response) => {
      console.log('Put Edit Data Api', response);
      this.loaddata();
    });
  }

  postDataApi(params: any) {
    this.http.post<any>(
      environment.fiatUserServiceUrl + '/fiat-users-controller/save-data', params
    ).toPromise().then((response) => {
      console.log('Post Data', response);
      this.loaddata();
    });
  }

  deleteDataApi(id: number) {
    this.http.delete<any>(
      environment.fiatUserServiceUrl + '/fiat-users-controller/delete-data', { params: { id: id.toString() } }
    ).toPromise().then((response) => {
      console.log('Delete Data from API:', response);
      this.loaddata();
    });
  }

  findAllApi(params: any) {
    this.http.get<any[]>(
      environment.fiatUserServiceUrl + '/fiat-users-controller/find-data-all', { params: params }
    ).toPromise().then((response) => {
      console.log('Find All Data from API:', response);
      this.userslist = response;
      
      this.userslist.forEach(user => {
        if (user.birthday) {
          user.birthday = new Date(user.birthday);
        }
        if (user.createDate) {
          user.createDate = new Date(user.createDate);
        }
        if (user.updateDate) {
          user.updateDate = new Date(user.updateDate);
        }
      });
      
      this.updateGraphData();
    });
  }

  formatAsYYYYMMDD(date: Date): string { 

    if (!date) {
      return ''; 
    }
    
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); 
    const day = date.getDate().toString().padStart(2, '0');

    return `${year}-${month}-${day}`;
  }

  }
