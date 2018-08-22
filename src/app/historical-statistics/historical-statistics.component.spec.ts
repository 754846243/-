import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoricalStatisticsComponent } from './historical-statistics.component';

describe('HistoricalStatisticsComponent', () => {
  let component: HistoricalStatisticsComponent;
  let fixture: ComponentFixture<HistoricalStatisticsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HistoricalStatisticsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HistoricalStatisticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
