
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ModalModule } from 'ngx-bootstrap/modal';
import { BsDatepickerModule, BsLocaleService } from 'ngx-bootstrap/datepicker';
import { FormsModule } from '@angular/forms';
import { defineLocale } from 'ngx-bootstrap/chronos';
import { thBeLocale } from 'ngx-bootstrap/locale';
import { TablebackendComponent } from './tablebackend.component';
import * as echarts from 'echarts';

describe('TablebackendComponent', () => {
  let component: TablebackendComponent;
  let fixture: ComponentFixture<TablebackendComponent>;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    defineLocale('th', thBeLocale);
    await TestBed.configureTestingModule({
      declarations: [TablebackendComponent],
      imports: [
        HttpClientTestingModule,
        ModalModule.forRoot(),
        BsDatepickerModule.forRoot(),
        FormsModule
      ],
      providers: [BsLocaleService]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TablebackendComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);

    // Spy on Echard methods to avoid errors
    spyOn(component, 'setupPieChart');
    spyOn(component, 'setupBarChart');

    // Mock Modal Directive
    component.exampleModal = jasmine.createSpyObj('ModalDirective', ['show', 'hide']);

    fixture.detectChanges();
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should create', () => {
    expect(component).toBeTruthy();

    // Expect GET call on init
    const req = httpMock.expectOne(req => req.url.includes('/fiat-users-controller/get-data-all'));
    expect(req.request.method).toBe('GET');
    req.flush([]);
  });

  describe('Utility Functions', () => {
    it('should calculate age correctly', () => {
      const today = new Date();
      const dob20 = new Date(today.getFullYear() - 20, today.getMonth(), today.getDate());
      expect(component.calAge(dob20)).toBe(20);
      expect(component.calAge(null)).toBe(0);
    });

    it('should format date as YYYY-MM-DD', () => {
      const date = new Date(2023, 0, 15); // Month is 0-indexed (Jan = 0)
      expect(component.formatAsYYYYMMDD(date)).toBe('2023-01-15');
    });
  });

  describe('Filtering', () => {
    /* 
       Note: The actual filtering logic in the component seems to be done on the Backend API side 
       (via findAllApi), so we test if the parameters are constructed correctly.
    */
    it('should call API with correct parameters on search', () => {
      // Set filter values
      component.filterId = '123';
      component.filterFullName = 'Test User';
      component.filterGender = 'ชาย';
      component.filterBirthday = new Date(2000, 0, 1);

      component.onSearch();

      const req = httpMock.expectOne(req => req.url.includes('/fiat-users-controller/find-data-all'));
      expect(req.request.method).toBe('GET');
      expect(req.request.params.get('id')).toBe('123');
      expect(req.request.params.get('firstname')).toBe('Test User');
      expect(req.request.params.get('gender')).toBe('ชาย');
      expect(req.request.params.has('birthday')).toBeTrue();
      req.flush([]);
    });

    it('should reset filters and reload data', () => {
      component.filterId = '999';
      component.onReset();

      expect(component.filterId).toBe('');
      const req = httpMock.expectOne(req => req.url.includes('/fiat-users-controller/get-data-all'));
      expect(req.request.method).toBe('GET');
      req.flush([]);
    });
  });

  describe('CRUD Operations', () => {
    it('should open modal for add', () => {
      component.onClickAdd();
      expect(component.isEditMode).toBeFalse();
      expect(component.exampleModal.show).toHaveBeenCalled();
    });

    it('should open modal for edit and load data', () => {
      const mockId = 10;
      component.onClickEdit(mockId);

      const req = httpMock.expectOne(req => req.url.includes('/fiat-users-controller/get-data-old-by-id'));
      expect(req.request.params.get('id')).toBe('10');
      req.flush([{ firstname: 'Old', lastname: 'Name', gender: 'ชาย', birthday: '2000-01-01' }]);

      expect(component.inputFirstname).toBe('Old');
      expect(component.isEditMode).toBeTrue();
      expect(component.exampleModal.show).toHaveBeenCalled();
    });

    it('should save new user (POST)', () => {
      component.isEditMode = false;
      component.inputFirstname = 'New';
      component.inputLastname = 'User';
      component.inputBirthdate = new Date(2000, 0, 1);

      component.onSave();

      const req = httpMock.expectOne(req => req.url.includes('/fiat-users-controller/save-data'));
      expect(req.request.method).toBe('POST');
      expect(req.request.body.firstname).toBe('New');
      req.flush({});

      expect(component.exampleModal.hide).toHaveBeenCalled();
      // Should reload data
      const reloadReq = httpMock.expectOne(req => req.url.includes('/fiat-users-controller/get-data-all'));
      reloadReq.flush([]);
    });

    it('should update user (PUT)', () => {
      component.isEditMode = true;
      component.currentEditId = 55;
      component.inputFirstname = 'Updated';
      component.inputBirthdate = new Date(2000, 0, 1);

      component.onSave();

      const req = httpMock.expectOne(req => req.url.includes('/fiat-users-controller/put-data'));
      expect(req.request.method).toBe('PUT');
      expect(req.request.body.id).toBe(55);
      req.flush({});

      expect(component.exampleModal.hide).toHaveBeenCalled();
      // Should reload data
      const reloadReq = httpMock.expectOne(req => req.url.includes('/fiat-users-controller/get-data-all'));
      reloadReq.flush([]);
    });

    it('should delete user when confirmed', () => {
      spyOn(window, 'confirm').and.returnValue(true);
      const mockId = 99;

      component.onClickDelete(mockId);

      const req = httpMock.expectOne(req => req.url.includes('/fiat-users-controller/delete-data'));
      expect(req.request.method).toBe('DELETE');
      expect(req.request.params.get('id')).toBe('99');
      req.flush({});

      // Should reload data
      const reloadReq = httpMock.expectOne(req => req.url.includes('/fiat-users-controller/get-data-all'));
      reloadReq.flush([]);
    });
  });

  it('should update graph data correctly', () => {
    component.userslist = [
      { gender: 'ชาย', age: 15 },
      { gender: 'หญิง', age: 25 },
      { gender: 'อื่นๆ', age: 35 },
      { gender: 'ชาย', age: 45 }
    ];

    component.updateGraphData();

    expect(component.maleCount).toBe(2);
    expect(component.femaleCount).toBe(1);
    expect(component.otherCount).toBe(1);

    expect(component.ageRange1).toBe(1);
    expect(component.ageRange2).toBe(1);
    expect(component.ageRange3).toBe(1);
    expect(component.ageRange4).toBe(1);

    expect(component.setupPieChart).toHaveBeenCalled();
    expect(component.setupBarChart).toHaveBeenCalled();
  });

});
