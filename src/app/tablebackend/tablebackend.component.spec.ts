import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TablebackendComponent } from './tablebackend.component';

describe('TablebackendComponent', () => {
  let component: TablebackendComponent;
  let fixture: ComponentFixture<TablebackendComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TablebackendComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TablebackendComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
