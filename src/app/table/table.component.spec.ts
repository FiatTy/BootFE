import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableComponent } from './table.component';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ModalModule } from 'ngx-bootstrap/modal';
import { BsDatepickerModule, BsLocaleService } from 'ngx-bootstrap/datepicker';
import { FormsModule } from '@angular/forms';
import { defineLocale } from 'ngx-bootstrap/chronos';
import { thLocale } from 'ngx-bootstrap/locale';

describe('TableComponent', () => {
  let component: TableComponent;
  let fixture: ComponentFixture<TableComponent>;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    defineLocale('th', thLocale);
    await TestBed.configureTestingModule({
      declarations: [TableComponent],
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
    fixture = TestBed.createComponent(TableComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);

    spyOn(component, 'setupPieChart');
    spyOn(component, 'setupBarChart');

    component.exampleModal = jasmine.createSpyObj('ModalDirective', ['show', 'hide']);

    fixture.detectChanges();
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should create', () => {
    expect(component).toBeTruthy();

    const req = httpMock.expectOne(req => req.url.includes('/fiat-users-controller/get-data-all'));
    expect(req.request.method).toBe('GET');
    req.flush({});
  });

  it('should calculate age correctly', () => {
    const today = new Date();
    const birthDate = new Date(today.getFullYear() - 20, today.getMonth(), today.getDate());

    expect(component.calAge(birthDate)).toBe(20);
    expect(component.calAge(null)).toBe(0);
  });

  describe('Filter Logic', () => {
    beforeEach(() => {
      component.userslist = [
        { id: 1, userpass: "123", firstname: "TestA", lastname: "UserA", gender: "ชาย", age: 25, createby: "Fiat", birthdate: new Date(1996, 0, 1), createdate: new Date() },
        { id: 2, userpass: "456", firstname: "TestB", lastname: "UserB", gender: "หญิง", age: 30, createby: "Admin", birthdate: new Date(1991, 0, 1), createdate: new Date() },
        { id: 3, userpass: "789", firstname: "TestC", lastname: "UserC", gender: "อื่นๆ", age: 35, createby: "Fiat", birthdate: new Date(1986, 0, 1), createdate: new Date() }
      ];
      component.filteredList = [...component.userslist];
    });

    it('should filter by name', () => {
      component.filterName = 'TestA';
      component.onSearch();
      expect(component.filteredList.length).toBe(1);
      expect(component.filteredList[0].firstname).toBe('TestA');
    });

    it('should filter by gender', () => {
      component.filterGender = 'หญิง';
      component.onSearch();
      expect(component.filteredList.length).toBe(1);
      expect(component.filteredList[0].gender).toBe('หญิง');
    });

    it('should filter by age', () => {
      component.filterAge = 30;
      component.onSearch();
      expect(component.filteredList.length).toBe(1);
      expect(component.filteredList[0].age).toBe(30);
    });

    it('should reset filters', () => {
      component.filterName = 'TestA';
      component.onSearch();
      expect(component.filteredList.length).toBe(1);

      component.onReset();
      expect(component.filterName).toBe('');
      expect(component.filteredList.length).toBe(3);
    });
  });

  describe('CRUD Operations', () => {
    it('should open modal for adding new user', () => {
      component.onClickAdd();
      expect(component.isEditMode).toBeFalse();
      expect(component.inputFirstname).toBe('');
      expect(component.exampleModal.show).toHaveBeenCalled();
    });

    it('should open modal for editing user', () => {
      const user = { id: 100, firstname: 'EditMe', lastname: 'Last', birthdate: new Date(), gender: 'ชาย' };
      component.onClickEdit(user);
      expect(component.isEditMode).toBeTrue();
      expect(component.currentEditId).toBe(100);
      expect(component.inputFirstname).toBe('EditMe');
      expect(component.exampleModal.show).toHaveBeenCalled();
    });

    it('should add a new user to the list', () => {
      component.userslist = [];
      component.isEditMode = false;

      component.inputFirstname = 'New';
      component.inputLastname = 'User';
      component.inputBirthdate = new Date(2000, 0, 1);
      component.inputGender = 'ชาย';

      component.onSave();

      expect(component.userslist.length).toBe(1);
      expect(component.userslist[0].firstname).toBe('New');
      expect(component.exampleModal.hide).toHaveBeenCalled();
      expect(component.setupPieChart).toHaveBeenCalled();
    });

    it('should update an existing user', () => {
      component.userslist = [
        { id: 10, firstname: 'OldName', lastname: 'OldLast', birthdate: new Date(), gender: 'ชาย', age: 20 }
      ];
      component.isEditMode = true;
      component.currentEditId = 10;

      component.inputFirstname = 'UpdatedName';
      component.inputLastname = 'UpdatedLast';
      component.inputBirthdate = new Date(2000, 0, 1); 
      component.inputGender = 'หญิง';

      component.onSave();

      expect(component.userslist[0].firstname).toBe('UpdatedName');
      expect(component.userslist[0].gender).toBe('หญิง');
      expect(component.exampleModal.hide).toHaveBeenCalled();
    });

    it('should delete a user when confirmed', () => {
      spyOn(window, 'confirm').and.returnValue(true);
      component.userslist = [
        { id: 1, firstname: 'User1' },
        { id: 2, firstname: 'User2' }
      ];

      component.onClickDelete(1);

      expect(component.userslist.length).toBe(1);
      expect(component.userslist[0].id).toBe(2);
      expect(component.setupPieChart).toHaveBeenCalled();
    });

    it('should NOT delete a user when cancelled', () => {
      spyOn(window, 'confirm').and.returnValue(false);
      component.userslist = [
        { id: 1, firstname: 'User1' },
        { id: 2, firstname: 'User2' }
      ];

      component.onClickDelete(1);

      expect(component.userslist.length).toBe(2);
    });
  });

  it('should calculate graph data correctly', () => {
    component.userslist = [
      { gender: 'ชาย', age: 15 },    
      { gender: 'ชาย', age: 25 },    
      { gender: 'หญิง', age: 35 },   
      { gender: 'อื่นๆ', age: 45 }    
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
