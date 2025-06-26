import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParticipationDialogComponent } from './participation-dialog.component';

describe('ParticipationDialogComponent', () => {
  let component: ParticipationDialogComponent;
  let fixture: ComponentFixture<ParticipationDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ParticipationDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ParticipationDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
