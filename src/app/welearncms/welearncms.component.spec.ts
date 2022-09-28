import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WelearncmsComponent } from './welearncms.component';

describe('WelearncmsComponent', () => {
  let component: WelearncmsComponent;
  let fixture: ComponentFixture<WelearncmsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WelearncmsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WelearncmsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
