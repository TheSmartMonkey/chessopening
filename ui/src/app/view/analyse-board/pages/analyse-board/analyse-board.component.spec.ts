import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnalyseBoardComponent } from './analyse-board.component';

describe('AnalyseBoardComponent', () => {
  let component: AnalyseBoardComponent;
  let fixture: ComponentFixture<AnalyseBoardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AnalyseBoardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AnalyseBoardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
