import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiFormComponent } from './api-form/api-form.component';
import { DropdownModule } from 'primeng/dropdown';
import { ReactiveFormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { AddExistingApiEffect } from './store/effects/createApi.effect';
import { EffectsModule } from '@ngrx/effects';
import { ButtonModule } from 'primeng/button';
import { DateRangeSelectComponent } from './date-range-select/date-range-select.component';
import { CalendarModule } from 'primeng/calendar';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { GetRefsEffect } from '../../page/store/effects/getRefs.effect';
import { ReferralGridComponent } from './referral-grid/referral-grid.component';

@NgModule({
  declarations: [
    ApiFormComponent,
    DateRangeSelectComponent,
    ReferralGridComponent,
  ],
  imports: [
    CommonModule,
    DropdownModule,
    CalendarModule,
    ButtonModule,
    FormsModule,
    RouterModule,
    ReactiveFormsModule,
    DialogModule,
    EffectsModule.forFeature([AddExistingApiEffect, GetRefsEffect]),
  ],
  exports: [
    ApiFormComponent,
    DialogModule,
    DateRangeSelectComponent,
    ReferralGridComponent,
  ],
})
export class SharedComponentsModule {}
