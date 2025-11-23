import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { PageComponent } from './page/page.component';
import { StoreModule } from '@ngrx/store';
import { reducers } from './store/reducers';
import { EffectsModule } from '@ngrx/effects';
import { CreateApiEffect } from './store/effects/createApi.effect';
import { StartBotEffect } from './store/effects/startBot.effect';
import { StopBotEffect } from './store/effects/stopBot.effect';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';

import { AccordionModule } from 'primeng/accordion';
import { GetUserInfoEffect } from './store/effects/getUserInfo.effect';
import { TableModule } from 'primeng/table';
import { DeleteApiEffect } from './store/effects/deleteApi.effect';

import { BotActionButtonComponent } from './bot-action-button/bot-action-button.component';
import { EditApiComponent } from './edit-api/edit-api.component';
import { EditApiEffect } from './store/effects/editApi.effect';
import { InputTextModule } from 'primeng/inputtext';
import { RouterModule } from '@angular/router';
import { FullStopBotEffect } from './store/effects/fullStopBot.effect';
import { SharedComponentsModule } from '../shared/shared-components/shared-components.module';
import { GetApiStatusesEffect } from './store/effects/getApiStatuses.effect';
import { AddEmailComponent } from './add-email/add-email.component';
import { TgAddEmailEffect } from './store/effects/tgAddEmail.effect';
import { StatComponent } from './stat/stat.component';
import { CalendarModule } from 'primeng/calendar';
import { FormsModule } from '@angular/forms';
import { GetReportsEffect } from './store/effects/getReports.effect';
import { BadgeModule } from 'primeng/badge';

@NgModule({
  declarations: [
    PageComponent,
    BotActionButtonComponent,
    EditApiComponent,
    AddEmailComponent,
    StatComponent,
  ],
  imports: [
    SharedComponentsModule,
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    ToastModule,
    InputTextModule,
    ButtonModule,
    DropdownModule,
    AccordionModule,
    FormsModule,
    TableModule,
    CalendarModule,
    BadgeModule,
    StoreModule.forFeature('page', reducers),
    EffectsModule.forFeature([
      CreateApiEffect,
      StartBotEffect,
      DeleteApiEffect,
      EditApiEffect,
      FullStopBotEffect,
      GetReportsEffect,
      GetApiStatusesEffect,
      TgAddEmailEffect,
      StopBotEffect,
      GetUserInfoEffect,
    ]),
  ],
  providers: [MessageService],
})
export class PageModule {}
